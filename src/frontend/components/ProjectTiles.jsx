import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ProjectSettingsModal from "./ProjectSettingsModal";
import { Search, SlidersHorizontal, X, ChevronDown, Check, Plus } from "lucide-react";

const STATUS_OPTIONS = ["All", "Planning", "Active", "In Progress", "Completed", "On Hold", "Cancelled"];
const PRIORITY_OPTIONS = ["All", "High", "Medium", "Low"];

// ── Custom dropdown component ──────────────────────────────────────────────
function FilterDropdown({ icon: Icon, value, options, onChange, formatLabel }) {
  const { isDark } = useTheme();
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
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium
          transition-all duration-150 select-none cursor-pointer
          ${isActive
            ? "bg-[#d97757]/10 dark:bg-[#d97757]/20 border-[#d97757]/40 text-[#d97757]"
            : "bg-white dark:bg-[#1e293b] border-gray-200 dark:border-slate-700 text-[#1D3557] dark:text-slate-200"
          }
          hover:border-[#d97757]/50 dark:hover:border-[#d97757]/40
        `}
      >
        {Icon && <Icon size={14} className="shrink-0 opacity-70" />}
        <span>{formatLabel(value)}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={`
            absolute left-0 top-full mt-2 z-50
            min-w-[140px] rounded-2xl border shadow-xl
            overflow-hidden
            bg-white dark:bg-[#1e293b]
            border-gray-100 dark:border-slate-700
            shadow-[0_8px_24px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)]
          `}
        >
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`
                  w-full flex items-center justify-between gap-3
                  px-4 py-2.5 text-sm text-left transition-colors duration-100
                  ${selected
                    ? "bg-[#d97757]/10 dark:bg-[#d97757]/20 text-[#d97757] font-semibold"
                    : "text-[#1D3557] dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/60"
                  }
                `}
              >
                <span>{formatLabel(opt)}</span>
                {selected && <Check size={13} className="text-[#d97757] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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

function NewProjectCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        min-h-40 w-full rounded-2xl border-2 border-dashed border-[#d97757]/40 dark:border-[#d97757]/50
        bg-[#d97757]/5 dark:bg-[#d97757]/10 p-4 shadow-sm
        hover:shadow-lg hover:-translate-y-1 hover:border-[#d97757]/70 hover:bg-[#d97757]/10 dark:hover:bg-[#d97757]/15
        transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer
      "
      aria-label="Create new project"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#d97757]/15 dark:bg-[#d97757]/25">
        <Plus size={28} className="text-[#d97757]" strokeWidth={2.5} />
      </div>
      <span className="text-sm font-semibold text-[#d97757]">New Project</span>
    </button>
  );
}

function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isAdmin, user } = useAuth();
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
  const canManageProject = isAdmin && project.ownerId === user?.id;

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
          {project.projectAdmin && (
            <p className="text-xs font-semibold text-[#d97757] mt-2">
              Project Admin: {project.projectAdmin}
            </p>
          )}
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
        {canManageProject && (
          <MenuItem onClick={handleSettingsClick} sx={{ py: 1.2, px: 2, gap: 1, "&:hover": { bgcolor: isDark ? "#334155" : undefined } }}>
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <SettingsRoundedIcon fontSize="small" sx={{ color: navyIcon }} />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600, color: navyIcon }}
            />
          </MenuItem>
        )}
      </Menu>

      {canManageProject && (
        <ProjectSettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          projectId={projectId}
        />
      )}
    </>
  );
}

export default function ProjectTiles() {
  const { projects, setOpenNewPrjModal } = useProject();
  const { isDark } = useTheme();
  const { isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const activeFilterCount = (statusFilter !== "All" ? 1 : 0) + (priorityFilter !== "All" ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setPriorityFilter("All");
  };

  const filteredProjects = (projects || []).filter((p) => {
    const matchesSearch =
      !searchQuery || p.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.projectStatus === statusFilter;
    const matchesPriority = priorityFilter === "All" || p.projectPriority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const inputBase = `
    flex items-center gap-2 px-3 py-2 rounded-xl border text-sm   
    transition-all duration-150 bg-white dark:bg-[#1e293b]
    border-gray-200 dark:border-slate-700
    text-[#1D3557] dark:text-slate-100
    focus-within:ring-2 focus-within:ring-[#d97757]/40 dark:focus-within:ring-[#d97757]/30
  `;

  if (!projects || projects.length === 0) {
    if (isAdmin) {
      return (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NewProjectCard onClick={() => setOpenNewPrjModal(true)} />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-[#e8f0ff] dark:bg-[#1e3a5f] rounded-full p-6 mb-4">
          <FolderOpenRoundedIcon sx={{ fontSize: "3rem", color: isDark ? "#93c5fd" : "#1D3557" }} />
        </div>
        <h2 className="text-xl font-bold text-[#1D3557] dark:text-slate-100 mb-1">
          No projects Assigned to you
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm">
          You&apos;ll see projects here once a project admin adds you to a team.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">

      {/* ── Search + Filter toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

        {/* Search */}
        <div className={`${inputBase} flex-1`}>
          <Search size={15} className="text-gray-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search projects by name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm text-[#1D3557] dark:text-slate-100"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">

          {/* Status filter */}
          <FilterDropdown
            icon={SlidersHorizontal}
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={setStatusFilter}
            formatLabel={(v) => v === "All" ? "All Statuses" : v}
          />

          {/* Priority filter */}
          <FilterDropdown
            value={priorityFilter}
            options={PRIORITY_OPTIONS}
            onChange={setPriorityFilter}
            formatLabel={(v) => v === "All" ? "All Priorities" : `${v} Priority`}
          />

          {/* Clear button */}
          {(activeFilterCount > 0 || searchQuery) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                         bg-[#d97757]/10 dark:bg-[#d97757]/20 text-[#d97757] border border-[#d97757]/30
                         hover:bg-[#d97757]/20 dark:hover:bg-[#d97757]/30 transition-all duration-150"
            >
              <X size={12} />
              Clear
              {activeFilterCount > 0 && (
                <span className="bg-[#d97757] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {(searchQuery || activeFilterCount > 0) && (
        <p className="text-xs text-gray-500 dark:text-slate-400 -mt-2">
          Showing <span className="font-semibold text-[#1D3557] dark:text-slate-200">{filteredProjects.length}</span> of {projects.length} projects
        </p>
      )}

      {/* ── Project grid ── */}
      {filteredProjects.length === 0 && !isAdmin ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-[#e8f0ff] dark:bg-slate-700/50 rounded-full p-5 mb-3">
            <Search size={28} className="text-[#1D3557]/40 dark:text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-[#1D3557] dark:text-slate-200 mb-1">No projects match your filters</h3>
          <p className="text-sm text-gray-400 dark:text-slate-500 mb-3">Try adjusting the search or filter criteria.</p>
          <button
            onClick={clearFilters}
            className="text-sm font-semibold text-[#d97757] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isAdmin && <NewProjectCard onClick={() => setOpenNewPrjModal(true)} />}
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id || project.id} project={project} />
            ))}
          </div>
          {filteredProjects.length === 0 && isAdmin && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <h3 className="text-base font-bold text-[#1D3557] dark:text-slate-200 mb-1">No projects match your filters</h3>
              <p className="text-sm text-gray-400 dark:text-slate-500 mb-3">Try adjusting the search or filter criteria.</p>
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-[#d97757] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
}
