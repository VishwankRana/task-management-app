import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import { useTheme } from "../context/ThemeContext";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ProjectSettingsModal from "./ProjectSettingsModal";

const STATUS_STYLES = {
  "Planning":    "bg-blue-100 text-blue-700 dark:bg-blue-500/25 dark:text-blue-200 dark:border dark:border-blue-500/50",
  "Active":      "bg-green-100 text-green-700 dark:bg-green-500/25 dark:text-green-200 dark:border dark:border-green-500/50",
  "In Progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/25 dark:text-yellow-200 dark:border dark:border-yellow-500/50",
  "Completed":   "bg-gray-100 text-gray-500 dark:bg-slate-500/25 dark:text-slate-200 dark:border dark:border-slate-500/50",
  "On Hold":     "bg-orange-100 text-orange-700 dark:bg-orange-500/25 dark:text-orange-200 dark:border dark:border-orange-500/50",
  "Cancelled":   "bg-red-100 text-red-600 dark:bg-red-500/25 dark:text-red-300 dark:border dark:border-red-500/50",
};

const PRIORITY_STYLES = {
  "High":   "bg-red-100 text-red-600 dark:bg-red-500/25 dark:text-red-200 dark:border dark:border-red-500/50",
  "Medium": "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/25 dark:text-yellow-200 dark:border dark:border-yellow-500/50",
  "Low":    "bg-green-100 text-green-700 dark:bg-green-500/25 dark:text-green-200 dark:border dark:border-green-500/50",
};

const PRIORITY_ACCENT = {
  "High":   "border-t-red-400",
  "Medium": "border-t-yellow-400",
  "Low":    "border-t-green-400",
};

function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);
  const navyIcon = isDark ? "#e2e8f0" : "#1d3557";

  const priority = project.projectPriority || "";
  const status = project.projectStatus || "Planning";
  const accentClass = PRIORITY_ACCENT[priority] || "border-t-gray-300";
  const statusClass = STATUS_STYLES[status] || "bg-gray-100 text-gray-500";
  const priorityClass = PRIORITY_STYLES[priority] || "bg-gray-100 text-gray-500";
  const projectId = project._id || project.id;

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleTasksClick = () => {
    handleMenuClose();
    navigate(`/projects/${projectId}/tasks?view=tasks`);
  };

  const handleCalendarClick = () => {
    handleMenuClose();
    navigate(`/projects/${projectId}/tasks?view=calendar`);
  };

  const handleAnalyticsClick = () => {
    handleMenuClose();
    navigate(`/projects/${projectId}/tasks?view=analytics`);
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    setSettingsOpen(true);
  };

  return (
    <>
      <div
        className={`
          min-h-40 w-full rounded-2xl border border-[#1d3557]/20 dark:border-slate-700
          bg-white dark:bg-[#1e293b] p-4 shadow-sm
          hover:shadow-lg hover:-translate-y-1
          transition-all duration-200 flex flex-col justify-between
          cursor-pointer
        `}
        onClick={() => navigate(`/projects/${projectId}/tasks`)}
      >
        {/* Title row + hamburger */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-bold text-[#1D3557] dark:text-slate-100 leading-snug">
              {project.projectName}
            </h2>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                flexShrink: 0,
                color: navyIcon,
                "&:hover": { bgcolor: isDark ? "#334155" : "#e8f0ff" },
                mt: "-4px",
                mr: "-6px",
              }}
            >
              <MenuRoundedIcon fontSize="small" />
            </IconButton>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">
            {project.projectDescription || "No description"}
          </p>
        </div>

        {/* Footer badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusClass}`}>
            {status}
          </span>
          {priority && (
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${priorityClass}`}>
              {priority} Priority
            </span>
          )}
        </div>
      </div>

      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(29,53,87,0.12)",
            minWidth: 160,
            border: isDark ? "1px solid #334155" : "1px solid #f0f0f0",
            bgcolor: isDark ? "#1e293b" : "#ffffff",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleTasksClick} sx={{ py: 1.2, px: 2, gap: 1, "&:hover": { bgcolor: isDark ? "#334155" : undefined } }}>
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <AssignmentRoundedIcon fontSize="small" sx={{ color: navyIcon }} />
          </ListItemIcon>
          <ListItemText
            primary="Tasks"
            primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600, color: navyIcon }}
          />
        </MenuItem>
        <MenuItem onClick={handleCalendarClick} sx={{ py: 1.2, px: 2, gap: 1, "&:hover": { bgcolor: isDark ? "#334155" : undefined } }}>
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <CalendarMonthRoundedIcon fontSize="small" sx={{ color: navyIcon }} />
          </ListItemIcon>
          <ListItemText
            primary="Calendar"
            primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600, color: navyIcon }}
          />
        </MenuItem>
        <MenuItem onClick={handleAnalyticsClick} sx={{ py: 1.2, px: 2, gap: 1, "&:hover": { bgcolor: isDark ? "#334155" : undefined } }}>
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <QueryStatsRoundedIcon fontSize="small" sx={{ color: navyIcon }} />
          </ListItemIcon>
          <ListItemText
            primary="Analytics"
            primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600, color: navyIcon }}
          />
        </MenuItem>
        <Divider sx={{ borderColor: isDark ? "#334155" : undefined }} />
        <MenuItem onClick={handleSettingsClick} sx={{ py: 1.2, px: 2, gap: 1, "&:hover": { bgcolor: isDark ? "#334155" : undefined } }}>
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <SettingsRoundedIcon fontSize="small" sx={{ color: navyIcon }} />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600, color: navyIcon }}
          />
        </MenuItem>
      </Menu>

      <ProjectSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        projectId={projectId}
      />
    </>
  );
}

export default function ProjectTiles() {
  const { projects } = useProject();
  const { isDark } = useTheme();

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-[#e8f0ff] dark:bg-[#1e3a5f] rounded-full p-6 mb-4">
          <FolderOpenRoundedIcon sx={{ fontSize: "3rem", color: isDark ? "#93c5fd" : "#1D3557" }} />
        </div>
        <h2 className="text-xl font-bold text-[#1D3557] dark:text-slate-100 mb-1">No projects yet</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Click "New Project" above to create your first project.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {projects.map((project) => (
        <ProjectCard key={project._id || project.id} project={project} />
      ))}
    </div>
  );
}
