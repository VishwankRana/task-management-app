import { useState, useMemo } from "react";
import Stack from "@mui/material/Stack";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import FolderOffRoundedIcon from "@mui/icons-material/FolderOffRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";
import TotalProjectTile from "../SummaryOverview/TotalProjectTile.jsx";
import CompletedProjects from "../SummaryOverview/CompletedProjects.jsx";
import InProgressProjectsTile from "../SummaryOverview/InProgressProjectsTile.jsx";
import MyTasksTile from "../SummaryOverview/MyTasks.jsx";
import ProjectOverview from "../ProjectOverview/ProjectOverview.jsx";
import RecentActivity from "../ProjectOverview/RecentActivity.jsx";
import TodaysFocus from "../DashboardWidgets/TodaysFocus.jsx";
import WeekAtAGlance from "../DashboardWidgets/WeekAtAGlance.jsx";
import { useProject } from "../context/ProjectContext";
import DarkModeToggle from "../components/DarkModeToggle.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import useTasks from "../hooks/useTasks.jsx";
import dayjs from "dayjs";

export default function Dashboard() {
  const { projects } = useProject();
  const { tasks } = useTasks();
  const { isDark } = useTheme();

  const [dismissed, setDismissed] = useState(new Set());
  const dismiss = (id) => setDismissed((prev) => new Set([...prev, id]));

  // ── Alert computation ─────────────────────────────────────────────────────
  const overdueTasks = useMemo(() => {
    const today = dayjs().startOf("day");
    return tasks.filter(
      (t) =>
        t.status !== "Completed" &&
        t.status !== "Cancelled" &&
        dayjs(t.dueDate).startOf("day").isBefore(today)
    );
  }, [tasks]);

  const dueSoonTasks = useMemo(() => {
    const today = dayjs().startOf("day");
    const in3Days = today.add(3, "day");
    return tasks.filter((t) => {
      if (t.status === "Completed" || t.status === "Cancelled") return false;
      const due = dayjs(t.dueDate).startOf("day");
      return !due.isBefore(today) && !due.isAfter(in3Days);
    });
  }, [tasks]);

  const overdueProjects = useMemo(() => {
    const today = dayjs().startOf("day");
    return projects.filter(
      (p) =>
        p.projectStatus !== "Completed" &&
        p.projectStatus !== "Cancelled" &&
        dayjs(p.projectEndDate).startOf("day").isBefore(today)
    );
  }, [projects]);

  const endingSoonProjects = useMemo(() => {
    const today = dayjs().startOf("day");
    const in3Days = today.add(3, "day");
    return projects.filter((p) => {
      if (p.projectStatus === "Completed" || p.projectStatus === "Cancelled") return false;
      const due = dayjs(p.projectEndDate).startOf("day");
      return !due.isBefore(today) && !due.isAfter(in3Days);
    });
  }, [projects]);

  const allBanners = useMemo(() => {
    const list = [];
    if (overdueTasks.length > 0)
      list.push({
        id: "overdue-tasks",
        type: "danger",
        Icon: AssignmentLateRoundedIcon,
        message: `${overdueTasks.length} task${overdueTasks.length > 1 ? "s are" : " is"} overdue — review and update their due dates.`,
      });
    if (overdueProjects.length > 0)
      list.push({
        id: "overdue-projects",
        type: "danger",
        Icon: FolderOffRoundedIcon,
        message: `${overdueProjects.length} project${overdueProjects.length > 1 ? "s have" : " has"} passed their deadline.`,
      });
    if (dueSoonTasks.length > 0)
      list.push({
        id: "due-soon-tasks",
        type: "warning",
        Icon: WarningAmberRoundedIcon,
        message: `${dueSoonTasks.length} task${dueSoonTasks.length > 1 ? "s are" : " is"} due within the next 3 days.`,
      });
    if (endingSoonProjects.length > 0)
      list.push({
        id: "ending-soon-projects",
        type: "warning",
        Icon: EventBusyRoundedIcon,
        message: `${endingSoonProjects.length} project${endingSoonProjects.length > 1 ? "s are" : " is"} ending within 3 days.`,
      });
    return list;
  }, [overdueTasks, overdueProjects, dueSoonTasks, endingSoonProjects]);

  const visibleBanners = allBanners.filter((b) => !dismissed.has(b.id));

  // ── Per-type color tokens (fully opaque) ──────────────────────────────────
  const alertSx = (type) => {
    const danger = isDark
      ? { bg: "#450a0a", fg: "#fca5a5", border: "#7f1d1d", iconColor: "#f87171", hoverBg: "rgba(220,38,38,0.25)" }
      : { bg: "#fef2f2", fg: "#991b1b", border: "#fecaca", iconColor: "#dc2626", hoverBg: "rgba(220,38,38,0.1)" };
    const warning = isDark
      ? { bg: "#451a03", fg: "#fde68a", border: "#92400e", iconColor: "#fbbf24", hoverBg: "rgba(217,119,6,0.25)" }
      : { bg: "#fffbeb", fg: "#92400e", border: "#fde68a", iconColor: "#d97706", hoverBg: "rgba(217,119,6,0.1)" };
    return type === "danger" ? danger : warning;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Stack spacing={3} alignItems="flex-start" className="w-full">
      {/* ── Sticky page header ────────────────────────────────────────── */}
      <div className="w-full px-6 py-4 bg-white dark:bg-[#1e293b] sticky top-0 z-10 shadow-[0_1px_0_0_#f0f0f0,0_2px_8px_0_rgba(29,53,87,0.06)] dark:shadow-[0_1px_0_0_#1e293b,0_2px_8px_0_rgba(0,0,0,0.3)] border-b-2 border-[#d97757]/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="bg-[#d97757]/10 rounded-lg p-1.5">
              <DashboardRoundedIcon sx={{ color: "#d97757", fontSize: "1.5rem" }} />
            </div>
            <div>
              <h1 className="text-[22px] font-[900] text-[#1D3557] dark:text-slate-100 leading-tight tracking-tight">
                Dashboard
              </h1>
              <p className="text-xs text-gray-400 dark:text-slate-400 leading-none mt-0.5">
                Here's what's happening with your projects today
              </p>
            </div>
          </div>
          <DarkModeToggle />
        </div>
      </div>

      {/* ── Dashboard body ────────────────────────────────────────────── */}
      <div className="w-full px-5 pb-5">

        {/* ── Due-date banners (inline, above stat tiles) ───────────── */}
        {visibleBanners.length > 0 && (
          <div className="flex flex-col gap-2 mb-6">
            {visibleBanners.map((banner) => {
              const c = alertSx(banner.type);
              return (
                <Alert
                  key={banner.id}
                  variant="outlined"
                  sx={{
                    bgcolor: c.bg,
                    color: c.fg,
                    border: `1px solid ${c.border}`,
                    borderRadius: "12px",
                    py: 1.25,
                    px: 2,
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    boxShadow: "none",
                    "--Alert-gap": "10px",
                  }}
                  startDecorator={
                    <banner.Icon sx={{ fontSize: "1.15rem", color: c.iconColor }} />
                  }
                  endDecorator={
                    <IconButton
                      size="sm"
                      onClick={() => dismiss(banner.id)}
                      sx={{
                        color: c.iconColor,
                        bgcolor: "transparent",
                        "&:hover": { bgcolor: c.hoverBg },
                        borderRadius: "8px",
                        minWidth: "28px",
                        minHeight: "28px",
                      }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: "1rem" }} />
                    </IconButton>
                  }
                >
                  {banner.message}
                </Alert>
              );
            })}
          </div>
        )}

        {/* ── Stat tiles row ────────────────────────────────────────── */}
        <div className="flex justify-between w-full mb-8">
          <TotalProjectTile />
          <CompletedProjects />
          <InProgressProjectsTile />
          <MyTasksTile />
        </div>

        {/* ── Lower panels ──────────────────────────────────────────── */}
        <div className="w-full flex justify-between gap-6">
          <div>
            <ProjectOverview />
            <RecentActivity />
          </div>
          <div className="flex flex-col flex-1 gap-8 min-w-0">
            <TodaysFocus />
            <WeekAtAGlance />
          </div>
        </div>
      </div>
    </Stack>
  );
}
