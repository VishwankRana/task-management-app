import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";

const PRIORITY_STYLES = {
  Low: "bg-blue-100 text-blue-700 dark:bg-blue-500/25 dark:text-blue-200 dark:border dark:border-blue-500/50",
  Medium: "bg-green-100 text-green-700 dark:bg-green-500/25 dark:text-green-200 dark:border dark:border-green-500/50",
  High: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/25 dark:text-yellow-200 dark:border dark:border-yellow-500/50",
  Urgent: "bg-red-100 text-red-700 dark:bg-red-500/25 dark:text-red-200 dark:border dark:border-red-500/50",
};

export default function KanbanTaskCard({ task, isDragging, onOpen, dragHandleProps }) {
  const navigate = useNavigate();
  const priorityClass = PRIORITY_STYLES[task?.priority] || "bg-gray-100 text-gray-600 dark:bg-slate-600/50 dark:text-slate-300";

  const handleOpen = () => {
    if (onOpen) {
      onOpen(task);
      return;
    }
    const taskId = task._id || task.id;
    const projectId = task.projectId;
    if (taskId && projectId) {
      navigate(`/projects/${projectId}/tasks/${taskId}`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      className={`
        rounded-xl border border-slate-200 dark:border-slate-600
        bg-white dark:bg-[#263446] p-3.5
        shadow-sm transition-all duration-200 cursor-pointer
        ${isDragging
          ? "shadow-xl rotate-[2deg] scale-[1.02] ring-2 ring-[#d97757]/40 border-[#d97757]/30"
          : "hover:shadow-md hover:-translate-y-0.5 hover:border-[#d97757]/30"
        }
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-bold text-[#1D3557] dark:text-slate-100 leading-snug line-clamp-2 flex-1">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${priorityClass}`}>
            {task.priority}
          </span>
          <button
            type="button"
            {...dragHandleProps}
            className="p-0.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing"
            aria-label="Drag task"
            onClick={(e) => e.stopPropagation()}
          >
            <DragIndicatorRoundedIcon sx={{ fontSize: "1rem" }} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-600/50">
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
          <PersonOutlineRoundedIcon sx={{ fontSize: "0.9rem", color: "#d97757" }} />
          <span className="truncate font-medium">
            {task.assigneeName || "Unassigned"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
          <EventRoundedIcon sx={{ fontSize: "0.9rem", color: "#1d3557" }} />
          <span>{task.dueDate ? dayjs(task.dueDate).format("MMM D, YYYY") : "No due date"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
          <CategoryRoundedIcon sx={{ fontSize: "0.9rem", color: "#6b7280" }} />
          <span>{task.type || "Task"}</span>
        </div>
      </div>
    </div>
  );
}
