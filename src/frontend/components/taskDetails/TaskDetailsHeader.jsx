import ArrowBackButton from "../ArrowBackButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import DarkModeToggle from "../DarkModeToggle";

const STATUS_STYLES = {
  Pending:
    "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-600/40 dark:text-slate-200 dark:border-slate-500/40",
  "In-progress":
    "bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-500/25 dark:text-blue-200 dark:border-blue-500/50",
  Completed:
    "bg-green-50 text-green-800 border border-green-200 dark:bg-green-500/25 dark:text-green-200 dark:border-green-500/50",
  Cancelled:
    "bg-red-50 text-red-800 border border-red-200 dark:bg-red-500/25 dark:text-red-200 dark:border-red-500/50",
};

const PRIORITY_STYLES = {
  Low: "bg-[#dbeafe] text-[#1e3a8a] border border-[#93c5fd] dark:bg-blue-500/25 dark:text-blue-200 dark:border-blue-400/50",
  Medium:
    "bg-[#dcfce7] text-[#14532d] border border-[#86efac] dark:bg-green-500/25 dark:text-green-200 dark:border-green-400/50",
  High: "bg-[#fef9c3] text-[#713f12] border border-[#fde047] dark:bg-yellow-500/25 dark:text-yellow-200 dark:border-yellow-400/50",
  Urgent:
    "bg-[#fee2e2] text-[#7f1d1d] border border-[#fca5a5] dark:bg-red-500/25 dark:text-red-200 dark:border-red-400/50",
};

export default function TaskDetailsHeader({
  task,
  projectName,
  onBack,
  onEdit,
}) {
  const statusClass = STATUS_STYLES[task?.status] || STATUS_STYLES.Pending;
  const priorityClass = PRIORITY_STYLES[task?.priority] || PRIORITY_STYLES.Medium;

  return (
    <>
      <div className="w-full px-6 py-4 bg-white dark:bg-[#1e293b] sticky top-0 z-10 shadow-[0_1px_0_0_#f0f0f0,0_2px_8px_0_rgba(29,53,87,0.06)] dark:shadow-[0_1px_0_0_#1e293b,0_2px_8px_0_rgba(0,0,0,0.3)] border-b-2 border-[#d97757]/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-[#d97757]/10 rounded-lg p-1.5 shrink-0">
              <AssignmentRoundedIcon sx={{ color: "#d97757", fontSize: "1.5rem" }} />
            </div>
            <div className="min-w-0">
              <h1 className="text-[22px] font-[900] text-[#1D3557] dark:text-slate-100 leading-tight tracking-tight truncate">
                Task Details
              </h1>
              <p className="text-xs text-gray-400 dark:text-slate-400 leading-none mt-0.5 truncate">
                {projectName || "Project"} — time tracking & timeline
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <DarkModeToggle />
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#263446] text-[#1D3557] dark:text-slate-100 text-sm font-semibold shadow-sm hover:shadow-md hover:border-[#d97757]/50 dark:hover:border-[#d97757]/50 transition-all"
              aria-label="Edit task"
            >
              <EditRoundedIcon sx={{ color: "#d97757", fontSize: "1.15rem" }} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4 w-full px-5 pt-2">
        <div className="mt-1.5 shrink-0">
          <ArrowBackButton onClick={onBack} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-[26px] sm:text-[30px] font-bold text-[#1D3557] dark:text-slate-100 leading-tight break-words">
            {task?.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusClass}`}>
              {task?.status === "In-progress" ? "In Progress" : task?.status}
            </span>
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${priorityClass}`}>
              {task?.priority}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
              {task?.type || "Task"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
