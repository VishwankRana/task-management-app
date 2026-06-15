import useTasks from "../hooks/useTasks";
import { useTheme } from "../context/ThemeContext";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import SentimentSatisfiedRoundedIcon from "@mui/icons-material/SentimentSatisfiedRounded";

export default function TodaysFocus() {
  const { tasks, loading } = useTasks();
  const { isDark } = useTheme();

  const today = new Date();

  const todaysTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    return (
      due.getFullYear() === today.getFullYear() &&
      due.getMonth() === today.getMonth() &&
      due.getDate() === today.getDate()
    );
  });

  const priorityStyle = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/25 dark:text-red-200 dark:border-red-400/50";
      case "High":
        return "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-500/25 dark:text-orange-200 dark:border-orange-400/50";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/25 dark:text-yellow-200 dark:border-yellow-400/50";
      default:
        return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/25 dark:text-blue-200 dark:border-blue-400/50";
    }
  };

  const completedCount = todaysTasks.filter(
    (t) => t.status === "Completed"
  ).length;

  const tealColor = isDark ? "#5eead4" : "#1f4d63";

  return (
    <div className="w-full h-[23em] flex flex-col rounded-2xl border border-[#1f4d63] dark:border-teal-700/50 bg-[#e8f4ff] dark:bg-[#1e293b] shadow-md hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="border-b border-[#1f4d63] dark:border-teal-700/50 px-4 py-3 flex items-center gap-2">
        <TodayRoundedIcon sx={{ color: tealColor, fontSize: "1.2rem" }} />
        <h1 className="text-sm font-semibold text-[#1f4d63] dark:text-teal-300">
          Today's Focus
        </h1>
        <span className="ml-auto bg-[#1f4d63] dark:bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {loading ? "…" : todaysTasks.length}
        </span>
      </div>

      {/* Progress bar (only when tasks exist) */}
      {!loading && todaysTasks.length > 0 && (
        <div className="px-4 pt-3 pb-1">
          <div className="flex justify-between text-xs text-[#1f4d63] dark:text-teal-300 mb-1 font-medium">
            <span>{completedCount} of {todaysTasks.length} done</span>
            <span>{Math.round((completedCount / todaysTasks.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#c2dff0] dark:bg-slate-700">
            <div
              className="h-1.5 rounded-full bg-[#1f4d63] dark:bg-teal-500 transition-all duration-500"
              style={{ width: `${(completedCount / todaysTasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="p-3 space-y-2 flex-1 overflow-y-auto">
        {loading && (
          <p className="text-sm text-gray-500 dark:text-slate-400 px-1">Loading…</p>
        )}

        {!loading && todaysTasks.length === 0 && (
          <div className="flex flex-col items-center py-5 text-center">
            <SentimentSatisfiedRoundedIcon sx={{ color: "#34d399", fontSize: "2.2rem" }} />
            <p className="text-sm font-medium text-gray-600 dark:text-slate-300 mt-2">
              No tasks due today!
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
              Enjoy your clear schedule
            </p>
          </div>
        )}

        {!loading &&
          todaysTasks.map((task) => (
            <div
              key={task._id}
              className="rounded-xl border border-[#d4d9e6] dark:border-slate-700 bg-white dark:bg-[#263446] p-3 shadow-sm
                         hover:shadow-md transition-shadow duration-200 flex items-start gap-2"
            >
              {task.status === "Completed" ? (
                <CheckCircleRoundedIcon
                  sx={{ color: "#34d399", fontSize: "1.1rem", mt: "2px", flexShrink: 0 }}
                />
              ) : (
                <RadioButtonUncheckedRoundedIcon
                  sx={{ color: isDark ? "#64748b" : "#9ca3af", fontSize: "1.1rem", mt: "2px", flexShrink: 0 }}
                />
              )}

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    task.status === "Completed"
                      ? "line-through text-gray-400 dark:text-slate-500"
                      : "text-gray-800 dark:text-slate-100"
                  }`}
                >
                  {task.title}
                </p>
                <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyle(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
