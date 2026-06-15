import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardRoundedIcon fontSize="small" />, path: "/" },
  { label: "Projects", icon: <FolderRoundedIcon fontSize="small" />, path: "/projects" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <aside
      className={`
        border-r border-gray-200 dark:border-slate-700 bg-[#f8faff] dark:bg-[#0f172a]
        h-screen fixed top-0 left-0
        flex flex-col transition-all duration-300 ease-in-out z-20
        ${collapsed ? "w-[68px]" : "w-64"}
      `}
    >
      {/* Branding */}
      <div className={`flex items-center border-b border-gray-200 dark:border-slate-700 h-[61px] px-3 ${collapsed ? "justify-center" : "justify-between px-4"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-[#d97757] text-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
              <TaskAltRoundedIcon sx={{ fontSize: "1.2rem" }} />
            </div>
            <span className="text-[20px] font-[900] text-[#1D3557] dark:text-slate-100 tracking-tight leading-none whitespace-nowrap overflow-hidden">
              Just do it.
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-400 dark:text-slate-200 hover:bg-[#e8f0ff] dark:hover:bg-slate-700 hover:text-[#1D3557] dark:hover:text-white transition-all duration-150"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <ChevronRightRoundedIcon fontSize="small" />
            : <ChevronLeftRoundedIcon fontSize="small" />
          }
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 flex flex-col gap-1 mt-2">
        {NAV_ITEMS.map(({ label, icon, path }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              title={collapsed ? label : undefined}
              className={`
                w-full flex items-center rounded-xl text-sm font-semibold
                transition-all duration-150
                ${collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-4 py-2.5"}
                ${
                  active
                    ? "bg-[#d97757] text-white shadow-sm shadow-orange-200"
                    : "text-[#1D3557] dark:text-slate-100 hover:bg-[#e8f0ff] dark:hover:bg-slate-700/60"
                }
              `}
            >
              <span className={`shrink-0 ${active ? "text-white" : "text-[#d97757]"}`}>
                {icon}
              </span>
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Dark mode toggle at bottom of sidebar */}
      <div className={`p-3 border-t border-gray-200 dark:border-slate-700 ${collapsed ? "flex justify-center" : ""}`}>
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={`
            flex items-center gap-2 rounded-xl border text-sm font-semibold
            transition-all duration-200 cursor-pointer select-none
            ${collapsed ? "p-2 justify-center" : "px-3 py-2 w-full"}
            ${isDark
              ? "bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600"
              : "bg-[#f0f4ff] border-[#d0d9f0] text-[#1D3557] hover:bg-[#e8f0ff]"
            }
          `}
        >
          {isDark
            ? <Sun size={16} className="text-yellow-400 shrink-0" />
            : <Moon size={16} className="text-[#1D3557] shrink-0" />
          }
          {!collapsed && (
            <span>{isDark ? "Light mode" : "Dark mode"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
