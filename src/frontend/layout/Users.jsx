import { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Stack, CircularProgress, IconButton } from "@mui/material";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SearchIcon from "@mui/icons-material/Search";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DarkModeToggle from "../components/DarkModeToggle";
import UserFeatureSettingsModal from "../components/UserFeatureSettingsModal";
import { Search, ChevronDown, Check, X } from "lucide-react";

const ROLE_OPTIONS = ["All", "Admin", "User"];

function RoleFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = value !== "All";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all
          ${isActive
            ? "bg-[#d97757]/10 dark:bg-[#d97757]/20 border-[#d97757]/40 text-[#d97757]"
            : "bg-white dark:bg-[#1e293b] border-gray-200 dark:border-slate-700 text-[#1D3557] dark:text-slate-200"
          }`}
      >
        <span>{value === "All" ? "All Roles" : value}</span>
        <ChevronDown size={13} className={`opacity-60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 min-w-[140px] rounded-2xl border shadow-xl bg-white dark:bg-[#1e293b] border-gray-100 dark:border-slate-700 overflow-hidden">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left
                ${opt === value
                  ? "bg-[#d97757]/10 dark:bg-[#d97757]/20 text-[#d97757] font-semibold"
                  : "text-[#1D3557] dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/60"
                }`}
            >
              <span>{opt === "All" ? "All Roles" : opt}</span>
              {opt === value && <Check size={13} className="text-[#d97757]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const roleBadge = (role) =>
  role === "Admin"
    ? "bg-orange-100 text-orange-700 dark:bg-orange-500/25 dark:text-orange-200 dark:border dark:border-orange-500/50"
    : "bg-blue-100 text-blue-700 dark:bg-blue-500/25 dark:text-blue-200 dark:border dark:border-blue-500/50";

export default function UsersLayout() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [settingsUser, setSettingsUser] = useState(null);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3000/api/auth/users", {
        params: {
          page,
          limit,
          search: search.trim() || undefined,
          role: roleFilter !== "All" ? roleFilter : undefined,
        },
      });
      setUsers(res.data.users ?? []);
      setTotalPages(res.data.totalPages ?? 1);
      setTotal(res.data.total ?? 0);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error ?? "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchUsers, search]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  return (
    <Stack spacing={3} alignItems="flex-start" className="w-full min-w-0 max-w-full">
      <div className="w-full px-6 py-4 bg-white dark:bg-[#1e293b] sticky top-0 z-10 shadow-[0_1px_0_0_#f0f0f0,0_2px_8px_0_rgba(29,53,87,0.06)] dark:shadow-[0_1px_0_0_#1e293b,0_2px_8px_0_rgba(0,0,0,0.3)] border-b-2 border-[#d97757]/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="bg-[#d97757]/10 rounded-lg p-1.5">
              <PeopleRoundedIcon sx={{ color: "#d97757", fontSize: "1.5rem" }} />
            </div>
            <div>
              <h1 className="text-[22px] font-[900] text-[#1D3557] dark:text-slate-100 leading-tight tracking-tight">
                Users
              </h1>
              <p className="text-xs text-gray-400 dark:text-slate-400 leading-none mt-0.5">
                Manage registered accounts
              </p>
            </div>
          </div>
          <DarkModeToggle />
        </div>
      </div>

      <div className="w-full px-5 pb-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus-within:ring-2 focus-within:ring-[#d97757]/40">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-[#1D3557] dark:text-slate-100 placeholder:text-gray-400"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>
          <RoleFilter value={roleFilter} onChange={setRoleFilter} />
        </div>

        <div className="w-full rounded-2xl border border-[#d6d3cd] dark:border-slate-700 bg-white dark:bg-[#1e293b] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="bg-[#fff1e3] dark:bg-[#3d2510] border-b border-[#c9b5a3] dark:border-orange-900/50">
                  <th className="text-left px-4 py-3 font-semibold text-[#3a2b20] dark:text-orange-100">Full Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#3a2b20] dark:text-orange-100">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#3a2b20] dark:text-orange-100">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#3a2b20] dark:text-orange-100">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#3a2b20] dark:text-orange-100">Created</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#3a2b20] dark:text-orange-100">Last Updated</th>
                  <th className="text-center px-4 py-3 font-semibold text-[#3a2b20] dark:text-orange-100 w-20">Settings</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <CircularProgress size={36} sx={{ color: "#d97757" }} />
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-3">Loading users…</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
                      <button
                        type="button"
                        onClick={fetchUsers}
                        className="px-4 py-2 rounded-xl bg-[#d97757] text-white text-sm font-semibold"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <SearchIcon sx={{ fontSize: "2.5rem", color: "#94a3b8" }} />
                      <p className="text-base font-bold text-[#1D3557] dark:text-slate-200 mt-3">No users found</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        {search || roleFilter !== "All"
                          ? "Try adjusting your search or filters."
                          : "No registered users yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-[#263446]/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-[#1D3557] dark:text-slate-100">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-slate-400">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${roleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-700 dark:bg-green-500/25 dark:text-green-200">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-slate-400 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-slate-400 whitespace-nowrap">{formatDate(user.updatedAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <IconButton
                          size="small"
                          onClick={() => setSettingsUser(user)}
                          aria-label={`Settings for ${user.name}`}
                          sx={{ color: "#d97757" }}
                        >
                          <SettingsRoundedIcon fontSize="small" />
                        </IconButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && !error && total > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0f172a]/30">
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} users
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-600 disabled:opacity-40 text-[#1D3557] dark:text-slate-200"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-600 disabled:opacity-40 text-[#1D3557] dark:text-slate-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <UserFeatureSettingsModal
        user={settingsUser}
        open={Boolean(settingsUser)}
        onClose={() => setSettingsUser(null)}
        onSaved={fetchUsers}
      />
    </Stack>
  );
}
