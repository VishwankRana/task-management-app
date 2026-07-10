import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "../components/DarkModeToggle.jsx";
import ArrowBackButton from "../components/ArrowBackButton.jsx";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default function AccountSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await api.get("/api/auth/me/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `task-manager-data-${user?.id ?? "export"}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Your data has been downloaded");
    } catch (err) {
      toast.error(err.response?.data?.error ?? "Failed to export data");
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteAccount() {
    if (!password) {
      toast.error("Enter your password to confirm deletion");
      return;
    }

    setDeleting(true);
    try {
      await api.delete("/api/auth/account", { data: { password } });
      await logout();
      toast.success("Account deleted");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error ?? "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ArrowBackButton />
          <div>
            <h1 className="text-2xl font-bold text-[#1D3557] dark:text-slate-100">Account & Privacy</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage your personal data
            </p>
          </div>
        </div>
        <DarkModeToggle />
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
          Your profile
        </h2>
        <p className="text-[#1D3557] dark:text-slate-100 font-semibold">{user?.name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 capitalize">{user?.role} account</p>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-100 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
          Export your data
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Download a JSON copy of your profile, project memberships, assigned tasks, and comments.
        </p>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: "#d97757" }}
        >
          {exporting ? "Preparing…" : "Download my data"}
        </button>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-red-200 dark:border-red-500/30 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-2">
          Delete account
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Permanently remove your account and personal data. Assigned tasks will be unassigned.
          {user?.role === "Admin" && " You must delete owned projects first."}
        </p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            Delete my account
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to confirm"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#263446] text-sm text-[#1D3557] dark:text-slate-100"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Confirm deletion"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPassword("");
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
