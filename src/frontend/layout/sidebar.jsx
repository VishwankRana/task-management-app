import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardRoundedIcon fontSize="small" />, path: "/" },
  { label: "Projects", icon: <FolderRoundedIcon fontSize="small" />, path: "/projects" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <aside
      className={`
        border-r border-gray-200 bg-[#f8faff] h-screen fixed top-0 left-0
        flex flex-col transition-all duration-300 ease-in-out z-20
        ${collapsed ? "w-[68px]" : "w-64"}
      `}
    >
      {/* Branding */}
      <div className={`flex items-center border-b border-gray-200 h-[61px] px-3 ${collapsed ? "justify-center" : "justify-between px-4"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-[#d97757] text-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
              <TaskAltRoundedIcon sx={{ fontSize: "1.2rem" }} />
            </div>
            <span className="text-[20px] font-[900] text-[#1D3557] tracking-tight leading-none whitespace-nowrap overflow-hidden">
              Just do it.
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-[#e8f0ff] hover:text-[#1D3557] transition-all duration-150"
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
                    : "text-[#1D3557] hover:bg-[#e8f0ff]"
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

    </aside>
  );
}
