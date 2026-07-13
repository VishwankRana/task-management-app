import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import { formatDateLong } from "../../utils/timeFormat";

const PRIORITY_STYLES = {
  Low: "text-blue-700 dark:text-blue-200",
  Medium: "text-green-700 dark:text-green-200",
  High: "text-yellow-800 dark:text-yellow-200",
  Urgent: "text-red-700 dark:text-red-200",
};

function InfoTile({ icon: Icon, label, value, valueClass = "" }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-[#263446] border border-slate-100 dark:border-slate-600/50 px-4 py-4 h-full flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-white dark:bg-[#1e293b] rounded-lg p-1.5 border border-slate-100 dark:border-slate-600/50">
          <Icon sx={{ color: "#d97757", fontSize: "1.15rem" }} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </p>
      </div>
      <p
        className={`text-base font-bold text-[#1D3557] dark:text-slate-100 break-words leading-snug pl-0.5 ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function TaskInfoCard({ task }) {
  const priority = task?.priority || "Medium";
  const priorityClass = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-[#1e293b] p-5 shadow-sm w-full h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className="bg-[#e8f0ff] dark:bg-[#1e3a5f] rounded-lg p-1.5">
          <InfoOutlinedIcon sx={{ color: "#1D3557", fontSize: "1.1rem" }} />
        </div>
        <h2 className="text-sm font-bold text-[#1D3557] dark:text-slate-100">Task Info</h2>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-3">
        <InfoTile
          icon={PersonOutlineRoundedIcon}
          label="Assignee"
          value={task?.assigneeName || "Unassigned"}
        />
        <InfoTile
          icon={EventRoundedIcon}
          label="Due Date"
          value={formatDateLong(task?.dueDate)}
        />
        <InfoTile
          icon={FlagRoundedIcon}
          label="Priority"
          value={priority}
          valueClass={priorityClass}
        />
        <InfoTile
          icon={CategoryRoundedIcon}
          label="Type"
          value={task?.type || "Task"}
        />
      </div>
    </div>
  );
}
