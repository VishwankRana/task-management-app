import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import useLiveTimer from "../../hooks/useLiveTimer";
import {
  formatClockDuration,
  formatHumanDuration,
  formatDateLong,
  formatTimeOnly,
  formatDateTimeShort,
} from "../../utils/timeFormat";

function CardShell({ children, accent = "default" }) {
  const accentClass =
    accent === "active"
      ? "border-[#d97757]/30"
      : accent === "done"
        ? "border-green-200 dark:border-green-500/30"
        : "border-slate-100 dark:border-slate-700";

  return (
    <div
      className={`rounded-2xl border ${accentClass} bg-white dark:bg-[#1e293b] p-5 shadow-sm h-full`}
    >
      {children}
    </div>
  );
}

export default function LiveTimerCard({ task }) {
  const isInProgress = task?.status === "In-progress";
  const isCompleted = task?.status === "Completed";
  const liveElapsed = useLiveTimer(task?.startedAt, isInProgress);

  if (!isInProgress && !isCompleted) {
    return (
      <CardShell>
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-1.5">
            <TimerOutlinedIcon sx={{ color: "#94a3b8", fontSize: "1.1rem" }} />
          </div>
          <h2 className="text-sm font-bold text-[#1D3557] dark:text-slate-100">
            Time Tracking
          </h2>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-[#263446] border border-dashed border-slate-200 dark:border-slate-600 px-4 py-6 text-center">
          <ScheduleRoundedIcon sx={{ color: "#94a3b8", fontSize: "1.75rem", mb: 1 }} />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Move this task to{" "}
            <span className="font-semibold text-[#1D3557] dark:text-slate-200">
              In Progress
            </span>{" "}
            to start the timer.
          </p>
        </div>
      </CardShell>
    );
  }

  if (isInProgress) {
    return (
      <CardShell accent="active">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#d97757]/10 rounded-lg p-1.5">
            <TimerOutlinedIcon sx={{ color: "#d97757", fontSize: "1.1rem" }} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1D3557] dark:text-slate-100">
              Currently Working
            </h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Live timer · updates every second
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#fff1e3] dark:bg-[#3d2510]/50 border border-[#d97757]/20 dark:border-orange-900/40 px-4 py-5 mb-4">
          <p className="text-4xl sm:text-5xl font-black tracking-tight text-[#1D3557] dark:text-slate-100 tabular-nums text-center">
            {formatClockDuration(liveElapsed)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-[#263446] border border-slate-100 dark:border-slate-600/50 px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
            Started
          </p>
          <p className="text-sm font-semibold text-[#1D3557] dark:text-slate-200">
            {formatDateLong(task?.startedAt)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {formatTimeOnly(task?.startedAt)}
          </p>
        </div>
      </CardShell>
    );
  }

  return (
    <CardShell accent="done">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-100 dark:bg-green-900/40 rounded-lg p-1.5">
          <CheckCircleOutlineRoundedIcon sx={{ color: "#16a34a", fontSize: "1.1rem" }} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#1D3557] dark:text-slate-100">
            Total Time
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Final duration for this task
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-500/20 px-4 py-5 mb-4">
        <p className="text-3xl sm:text-4xl font-black tracking-tight text-[#1D3557] dark:text-slate-100 text-center">
          {formatHumanDuration(task?.timeSpent ?? 0)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 dark:bg-[#263446] border border-slate-100 dark:border-slate-600/50 px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
            Started
          </p>
          <p className="text-sm font-semibold text-[#1D3557] dark:text-slate-200">
            {formatDateTimeShort(task?.startedAt)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-[#263446] border border-slate-100 dark:border-slate-600/50 px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
            Completed
          </p>
          <p className="text-sm font-semibold text-[#1D3557] dark:text-slate-200">
            {formatDateTimeShort(task?.completedAt)}
          </p>
        </div>
      </div>
    </CardShell>
  );
}
