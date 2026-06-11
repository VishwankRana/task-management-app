import { useState, useMemo } from "react";
import useTasks from "../hooks/useTasks";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

function getWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const priorityDot = (priority) => {
  switch (priority) {
    case "Urgent": return "bg-red-500";
    case "High":   return "bg-orange-400";
    case "Medium": return "bg-yellow-400";
    default:       return "bg-blue-400";
  }
};

export default function WeekAtAGlance() {
  const { tasks, loading } = useTasks();
  const [hoveredDay, setHoveredDay] = useState(null);

  const weekDays = useMemo(() => getWeekDays(), []);
  const today = new Date();

  const tasksByDay = useMemo(() => {
    return weekDays.map((day) =>
      tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), day))
    );
  }, [tasks, weekDays]);

  const maxCount = Math.max(...tasksByDay.map((d) => d.length), 1);

  return (
    <div className="w-full min-h-[30em] flex flex-col rounded-2xl border border-[#1f4d63] bg-[#e8f4ff] shadow-md hover:shadow-lg transition-all duration-200">

      {/* Header */}
      <div className="border-b border-[#1f4d63] px-4 py-3 flex items-center gap-2">
        <CalendarMonthRoundedIcon sx={{ color: "#1f4d63", fontSize: "1.2rem" }} />
        <h1 className="text-sm font-semibold text-[#1f4d63]">Week at a Glance</h1>
        <span className="ml-auto text-xs text-[#1f4d63] font-medium opacity-70">
          {weekDays[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          {" – "}
          {weekDays[6].toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </span>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : (
          <>
            {/* Columns */}
            <div className="flex gap-2 items-end flex-1">
              {weekDays.map((day, i) => {
                const dayTasks = tasksByDay[i];
                const count = dayTasks.length;
                const isToday = isSameDay(day, today);
                const isHovered = hoveredDay === i;
                const barHeight = count === 0 ? 4 : Math.max(16, Math.round((count / maxCount) * 80));

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2 cursor-default relative"
                    onMouseEnter={() => setHoveredDay(i)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* Hover tooltip */}
                    {isHovered && count > 0 && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20
                                      bg-[#1f4d63] text-white text-xs rounded-xl shadow-lg
                                      p-2 w-36 pointer-events-none">
                        <p className="font-semibold mb-1 border-b border-white/20 pb-1">
                          {day.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
                        </p>
                        <ul className="space-y-1">
                          {dayTasks.map((t) => (
                            <li key={t._id} className="flex items-center gap-1.5 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot(t.priority)}`} />
                              <span className="truncate">{t.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Task count badge */}
                    <span className={`text-xs font-bold ${count === 0 ? "text-gray-300" : "text-[#1f4d63]"}`}>
                      {count > 0 ? count : ""}
                    </span>

                    {/* Bar */}
                    <div className="w-full flex items-end justify-center">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300
                          ${count === 0
                            ? "bg-gray-200"
                            : isToday
                            ? "bg-[#d97757]"
                            : "bg-[#1f4d63]/70 hover:bg-[#1f4d63]"
                          }`}
                        style={{ height: `${barHeight}px` }}
                      />
                    </div>

                    {/* Day label */}
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-xs font-semibold ${
                          isToday ? "text-[#d97757]" : "text-[#1f4d63]"
                        }`}
                      >
                        {DAY_LABELS[i]}
                      </span>
                      <span className={`text-[10px] ${isToday ? "text-[#d97757] font-bold" : "text-gray-400"}`}>
                        {day.getDate()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-3 pt-3 border-t border-[#1f4d63]/20 flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#d97757] inline-block" /> Today
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#1f4d63]/70 inline-block" /> Tasks due
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gray-200 inline-block" /> No tasks
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
