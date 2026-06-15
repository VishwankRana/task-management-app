import { useState } from "react";

const week_days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TasksCalenderView({ taskList = [] }) {

  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];

  const [currentDate, setCurrentDate] = useState(today);
  const [activeDay, setActiveDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const changeMonth = (dir) => {
    setCurrentDate(new Date(year, month + dir, 1));
    setActiveDay(null);
  };

  // Group tasks by date (ignore completed/cancelled)
  const tasksByDate = taskList.reduce((acc, task) => {
    if (task.status === "Completed" || task.status === "Cancelled") return acc;

    const key = new Date(task.dueDate).toISOString().split("T")[0];
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const selectedDate =
    activeDay !== null
      ? `${year}-${String(month + 1).padStart(2, "0")}-${String(activeDay).padStart(2, "0")}`
      : null;

  const upcomingTasks = taskList
    .filter(task => {
      if (task.status === "Completed" || task.status === "Cancelled") return false;

      if (!selectedDate) return true;

      const taskDate = new Date(task.dueDate).toISOString().split("T")[0];
      return taskDate === selectedDate;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // 🎨 STATUS BADGE COLOR SYSTEM
  const statusBadgeClass = (status) => {
    switch (status) {

      case "In-progress":
        return "bg-[#fff1e3] text-[#b4530d] border-[#e4c4a8] dark:bg-orange-500/25 dark:text-orange-200 dark:border-orange-400/50";

      case "Pending":
        return "bg-[#fff7d1] text-[#7a6308] border-[#e8ce69] dark:bg-yellow-500/25 dark:text-yellow-200 dark:border-yellow-400/50";

      case "Completed":
        return "bg-[#e9f7ec] text-[#2a7a35] border-[#9cdfb0] dark:bg-green-500/25 dark:text-green-200 dark:border-green-400/50";

      case "Overdue":
        return "bg-[#ffe4e4] text-[#9b1c1c] border-[#f5a3a3] dark:bg-red-500/25 dark:text-red-200 dark:border-red-400/50";

      case "Cancelled":
        return "bg-[#f1f1f1] text-[#6b7280] border-[#d1d5db] dark:bg-slate-500/25 dark:text-slate-300 dark:border-slate-400/50";

      default:
        return "bg-[#ececec] text-[#555] border-[#d6d6d6] dark:bg-slate-500/25 dark:text-slate-300 dark:border-slate-400/50";
    }
  };

  return (
    <div className="flex w-280 justify-between">

      {/* =========================
          CALENDAR PANEL
      ==========================*/}
      <div className="rounded-2xl border border-[#d6d3cd] dark:border-slate-700 bg-white dark:bg-[#1e293b] shadow-sm p-6 h-107 w-180 my-5 overflow-hidden">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#b4530d] dark:text-orange-400">
            Task Calendar
          </h2>

          <div className="flex items-center gap-4">
            <button
              onClick={() => changeMonth(-1)}
              className="text-[#b4530d] dark:text-orange-400 font-bold opacity-70 hover:opacity-100"
            >
              ‹
            </button>

            <span className="font-medium text-[#1f2937] dark:text-slate-200">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>

            <button
              onClick={() => changeMonth(1)}
              className="text-[#b4530d] dark:text-orange-400 font-bold opacity-70 hover:opacity-100"
            >
              ›
            </button>
          </div>
        </div>

        {/* Week Row */}
        <div className="grid grid-cols-7 gap-3 mb-2 text-sm text-[#6b4e0b] dark:text-slate-300 font-medium">
          {week_days.map(day => (
            <div key={day} className="text-center">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-3">

          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {

            const day = i + 1;

            const cellKey =
              `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const isToday = cellKey === todayKey;
            const isActive = activeDay === day;
            const taskCount = tasksByDate[cellKey] || 0;

            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`
                  h-13 w-20 rounded-lg flex flex-col items-center justify-center
                  transition cursor-pointer border

                  ${
                    isToday
                      ? "bg-[#d97757] text-white border-[#b86242]"
                      : isActive
                      ? "bg-white dark:bg-[#1e3a5f] border-[#d97757] dark:border-blue-400 text-[#b4530d] dark:text-blue-200"
                      : "bg-[#E7E6DF] dark:bg-slate-700/80 border-[#c9c7b8] dark:border-slate-600 hover:bg-[#f5eee6] dark:hover:bg-slate-600 dark:text-slate-100"
                  }
                `}
              >
                <span className="text-sm font-semibold">{day}</span>

                {taskCount > 0 && (
                  <span className={`text-xs font-medium ${isToday ? "text-white/90" : "text-[#6b4e0b] dark:text-orange-400"}`}>
                    {taskCount} task{taskCount > 1 ? "s" : ""}
                  </span>
                )}
              </button>
            );
          })}

        </div>
      </div>

      {/* =========================
          UPCOMING TASKS PANEL
      ==========================*/}
      <div className="rounded-2xl border border-[#d6d3cd] dark:border-slate-700 bg-white dark:bg-[#1e293b] shadow-sm p-6 w-90 h-107 flex flex-col my-5">

        <div className="flex justify-between items-center mb-3">
          <p className="text-lg font-semibold text-[#1f2937] dark:text-slate-200">
            Upcoming Tasks
          </p>

          {selectedDate && (
            <button
              onClick={() => setActiveDay(null)}
              className="text-sm text-[#b4530d] dark:text-orange-400 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">

          {upcomingTasks.length === 0 && (
            <p className="text-sm text-gray-600 dark:text-slate-400">
              No tasks for this day
            </p>
          )}

          {upcomingTasks.map(task => (
            <div
              key={task._id}
              className="bg-white dark:bg-slate-800 border border-[#e2d9cc] dark:border-slate-700 rounded-xl p-3 shadow-sm"
            >
              <div className="flex justify-between">
                <p className="font-semibold text-[#1f2937] dark:text-slate-200">
                  {task.title}
                </p>

                <span
                  className={`text-xs px-2 py-1 rounded-lg border font-semibold
                    ${statusBadgeClass(task.status)}`}
                >
                  {task.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Due: {new Date(task.dueDate).toDateString()}
              </p>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
