import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, UserPlus, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AddProjectMember({ projectId, ownerId, initialMembers = [], onMembersChange }) {
  const { user, isAdmin } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [members, setMembers] = useState(initialMembers);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);

  const canManageMembers = isAdmin && ownerId === user?.id;

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  useEffect(() => {
    if (!canManageMembers) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [canManageMembers]);

  useEffect(() => {
    if (!canManageMembers || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await axios.get("http://localhost:3000/api/taskmanager/users/search", {
          params: { q: query.trim(), projectId },
        });
        setResults(res.data);
        setShowResults(true);
      } catch (err) {
        console.error(err);
        toast.error("Failed to search users");
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, projectId, canManageMembers]);

  async function handleAddMember() {
    if (!selectedUser) {
      toast.error("Select a user to add");
      return;
    }

    setAdding(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/taskmanager/projects/${projectId}/members`,
        { userId: selectedUser.id }
      );
      const updatedMembers = [...members, res.data];
      setMembers(updatedMembers);
      onMembersChange?.(updatedMembers);
      setQuery("");
      setSelectedUser(null);
      setResults([]);
      setShowResults(false);
      toast.success(`${res.data.name} added to project`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add user");
    } finally {
      setAdding(false);
    }
  }

  if (!canManageMembers) return null;

  const inputCls =
    "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#263446] text-[#1d3557] dark:text-white placeholder-black dark:placeholder-black focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm";

  return (
    <div className="w-full px-5">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#d97757]/10 rounded-lg p-1.5">
            <UserPlus size={18} className="text-[#d97757]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1D3557] dark:text-slate-100">
              Add Team Members
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Search registered users and add them to this project
            </p>
          </div>
        </div>

        <div ref={containerRef} className="relative flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={selectedUser ? `${selectedUser.name} (${selectedUser.email})` : query}
              onChange={(e) => {
                setSelectedUser(null);
                setQuery(e.target.value);
              }}
              onFocus={() => results.length > 0 && setShowResults(true)}
              placeholder="Search by name or email..."
              className={inputCls}
            />

            {showResults && results.length > 0 && !selectedUser && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-[#1e293b] shadow-xl overflow-hidden">
                {results.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      setSelectedUser(result);
                      setShowResults(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700/60 transition"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#1D3557] dark:text-slate-100">
                        {result.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{result.email}</p>
                    </div>
                    {selectedUser?.id === result.id && (
                      <Check size={14} className="text-[#d97757]" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {showResults && query.trim().length >= 2 && !searching && results.length === 0 && !selectedUser && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-[#1e293b] shadow-xl px-4 py-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">No users found</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddMember}
            disabled={adding || !selectedUser}
            className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-50 cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: "#d97757" }}
          >
            {adding ? "Adding..." : "Add to Project"}
          </button>
        </div>

        {members.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Project Members
            </p>
            <div className="flex flex-wrap gap-2">
              {members.map((member) => (
                <span
                  key={member.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#e8f0ff] dark:bg-slate-700 text-[#1D3557] dark:text-slate-100 border border-slate-200 dark:border-slate-600"
                >
                  <span className="w-6 h-6 rounded-full bg-[#d97757] text-white flex items-center justify-center text-[10px]">
                    {member.name?.charAt(0).toUpperCase()}
                  </span>
                  {member.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
