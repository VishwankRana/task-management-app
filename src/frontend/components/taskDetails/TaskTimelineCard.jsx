import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import EventRepeatRoundedIcon from "@mui/icons-material/EventRepeatRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { formatTimelineDate } from "../../utils/timeFormat";

const ACTION_ICONS = {
  "Task Created": AddCircleOutlineRoundedIcon,
  Assigned: PersonAddAltRoundedIcon,
  "Status changed": SwapHorizRoundedIcon,
  "Priority changed": TrendingUpRoundedIcon,
  "Due date updated": EventRepeatRoundedIcon,
  "Task Completed": TaskAltRoundedIcon,
};

function TimelineItem({ entry, isLast }) {
  const Icon = ACTION_ICONS[entry.action] || HistoryRoundedIcon;
  const { date, time } = formatTimelineDate(entry.createdAt);
  const showDescription =
    entry.description &&
    entry.action !== "Task Created" &&
    entry.action !== "Due date updated" &&
    entry.action !== "Task Completed";

  return (
    <div className="relative flex gap-3.5 pb-5 last:pb-0">
      {!isLast && (
        <span className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-600" />
      )}

      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d97757]/10 border border-[#d97757]/25">
        <Icon sx={{ fontSize: "0.95rem", color: "#d97757" }} />
      </div>

      <div className="min-w-0 flex-1 rounded-xl bg-slate-50 dark:bg-[#263446] border border-slate-100 dark:border-slate-600/50 px-3.5 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1D3557] dark:text-slate-100">
              {entry.action === "Assigned" ? entry.description : entry.action}
            </p>
            {showDescription && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 whitespace-pre-line">
                {entry.description}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{date}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaskTimelineCard({ history, loading }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-[#1e293b] p-5 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-[#e8f0ff] dark:bg-[#1e3a5f] rounded-lg p-1.5">
          <HistoryRoundedIcon sx={{ color: "#1D3557", fontSize: "1.1rem" }} />
        </div>
        <h2 className="text-sm font-bold text-[#1D3557] dark:text-slate-100">
          Task Timeline
        </h2>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
          Loading timeline...
        </p>
      ) : history.length === 0 ? (
        <div className="rounded-xl bg-slate-50 dark:bg-[#263446] border border-dashed border-slate-200 dark:border-slate-600 px-4 py-8 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            No activity recorded yet.
          </p>
        </div>
      ) : (
        <div className="max-h-[28rem] overflow-y-auto pr-1">
          {history.map((entry, index) => (
            <TimelineItem
              key={entry.id}
              entry={entry}
              isLast={index === history.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
