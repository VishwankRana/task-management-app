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

  const tasksByDate = taskList.reduce((acc, task) => {
    if (task.status === "Completed" || task.status === "Cancelled") {
      return acc;
    }

    const dateKey = new Date(task.dueDate)
      .toISOString()
      .split("T")[0];

    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  const selectedDate =
    activeDay !== null
      ? `${year}-${String(month + 1).padStart(2, "0")}-${String(activeDay).padStart(2, "0")}`
      : null;

  const upcomingTasks = taskList
    .filter((task) => {
      if (task.status === "Completed" || task.status === "Cancelled") {
        return false;
      }

      if (!selectedDate) return true;

      const taskDate = new Date(task.dueDate)
        .toISOString()
        .split("T")[0];

      return taskDate === selectedDate;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="flex w-280 justify-between">

      <div className="rounded-xl border border-white/10 bg-[#eeeee6] p-6 h-107 w-180 overflow-hidden">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-l font-semibold text-black flex items-center gap-2">
            📅 Task Calendar
          </h2>

          <div className="flex items-center gap-4 text-black">
            <button onClick={() => changeMonth(-1)} className="opacity-60 hover:opacity-100">
              ‹
            </button>

            <span className="font-medium">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>

            <button onClick={() => changeMonth(1)} className="opacity-60 hover:opacity-100">
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 mb-3 text-sm text-black">
          {week_days.map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">

          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isActive = activeDay === day;

            const cellDateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = cellDateKey === todayKey;
            const taskCount = tasksByDate[cellDateKey] || 0;

            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`h-13 w-20 rounded-lg
                  flex flex-col items-center justify-center
                  transition cursor-pointer
                  ${
                    isActive ? "bg-blue-600 text-white" : "bg-[#D7D7CE] hover:bg-[#E8EADF]"
                  }
                  ${ isToday ? "bg-[#d97658] text-white" : "bg-[#D7D7CE] hover:bg-[#E8EADF]"}`}
              >
                <span className="text-sm font-medium">{day}</span>

                {taskCount > 0 && (
                  <span className="text-xs">
                    {taskCount} task{taskCount > 1 ? "s" : ""}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#eeeee6] p-6 w-90 h-107 flex flex-col">

        <div className="flex justify-between items-center mb-3">
          <p className="text-l font-semibold text-black">
            Upcoming Tasks
          </p>

          {selectedDate && (
            <button
              onClick={() => setActiveDay(null)}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">
          {upcomingTasks.length === 0 && (
            <p className="text-sm text-gray-600">
              No tasks for this day
            </p>
          )}

          {upcomingTasks.map((task) => (
            <div
              key={task._id}
              className="bg-[#d6d7cc] w-full rounded-xl p-3"
            >
              <div className="flex justify-between">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm">{task.status}</p>
              </div>

              <p className="text-sm text-gray-700">
                Due: {new Date(task.dueDate).toDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
