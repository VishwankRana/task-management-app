import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "../components/DarkModeToggle.jsx";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { establishSession } = useAuth();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      setError("Invalid or missing reset link.");
      return;
    }

    api
      .get("/api/auth/reset-password/verify", { params: { token } })
      .then(() => setTokenValid(true))
      .catch(() => {
        setTokenValid(false);
        setError("This reset link is invalid or has expired.");
      })
      .finally(() => setVerifying(false));
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters with one letter and one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/reset-password", { token, password });
      establishSession(res.data.user);
      setSuccess(res.data.message);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff] dark:bg-[#0f172a] px-4">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="bg-[#d97757] text-white rounded-lg p-1.5 flex items-center justify-center">
          <TaskAltRoundedIcon sx={{ fontSize: "1.5rem" }} />
        </div>
        <span className="text-[25px] font-[700] text-[#1D3557] dark:text-slate-100 tracking-tight leading-none">
          Just do it.
        </span>
      </div>
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#1d3557] dark:text-slate-100">Reset password</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Choose a new password for your account
            </p>
          </div>

          {verifying ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-3">Verifying link…</p>
            </div>
          ) : !tokenValid ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Link to="/forgot-password" className="font-semibold text-[#d97757] hover:underline text-sm">
                Request a new reset link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1d3557] dark:text-slate-200 mb-1.5">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#263446] text-[#1D3557] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">At least 8 characters with one letter and one number</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1d3557] dark:text-slate-200 mb-1.5">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#263446] text-[#1D3557] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-4 py-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 px-4 py-3">
                  <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
                style={{ backgroundColor: "#d97757" }}
              >
                {loading ? "Resetting…" : "Reset password"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            <Link to="/login" className="font-semibold text-[#d97757] hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
