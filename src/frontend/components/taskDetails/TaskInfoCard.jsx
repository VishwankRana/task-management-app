import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import { formatDateLong } from "../../utils/timeFormat";

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-[#263446] border border-slate-100 dark:border-slate-600/50 px-3.5 py-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon sx={{ color: "#d97757", fontSize: "0.95rem" }} />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </p>
      </div>
      <p className="text-sm font-semibold text-[#1D3557] dark:text-slate-100 break-words">
        {value}
      </p>
    </div>
  );
}

export default function TaskInfoCard({ task }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-[#1e293b] p-5 shadow-sm w-full h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-[#e8f0ff] dark:bg-[#1e3a5f] rounded-lg p-1.5">
          <InfoOutlinedIcon sx={{ color: "#1D3557", fontSize: "1.1rem" }} />
        </div>
        <h2 className="text-sm font-bold text-[#1D3557] dark:text-slate-100">Task Info</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          value={task?.priority || "Medium"}
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
