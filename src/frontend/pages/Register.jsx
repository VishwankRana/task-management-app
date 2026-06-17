import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import DarkModeToggle from "../components/DarkModeToggle.jsx";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
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
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
              style={{ backgroundColor: "#d97757" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1d3557] dark:text-slate-100">
              Create account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Get started with Task Manager
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#1d3557] dark:text-slate-200 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#263446] text-[#1d3557] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1d3557] dark:text-slate-200 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#263446] text-[#1d3557] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1d3557] dark:text-slate-200 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#263446] text-[#1d3557] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1d3557] dark:text-slate-200 mb-2">
                Account type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("User")}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    role === "User"
                      ? "border-[#d97757] bg-[#d97757]/10 dark:bg-[#d97757]/20"
                      : "border-slate-200 dark:border-slate-600 bg-white dark:bg-[#263446]"
                  }`}
                >
                  <p className="text-sm font-semibold text-[#1d3557] dark:text-slate-100">User</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    View projects and manage tasks
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("Admin")}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    role === "Admin"
                      ? "border-[#d97757] bg-[#d97757]/10 dark:bg-[#d97757]/20"
                      : "border-slate-200 dark:border-slate-600 bg-white dark:bg-[#263446]"
                  }`}
                >
                  <p className="text-sm font-semibold text-[#1d3557] dark:text-slate-100">Admin</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Create and manage projects
                  </p>
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-4 py-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-60 cursor-pointer"
              style={{ backgroundColor: "#d97757" }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#d97757] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
