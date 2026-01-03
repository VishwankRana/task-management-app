import useTasks from "../hooks/useTasks";

export default function OverdueSummary() {

  const { overdueTasks, loading } = useTasks();

  const topOverdueTasks = overdueTasks
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 2);

  return (
    <div className="w-[20em] rounded-2xl border border-[#b0121c]
                    bg-[#ffe6e8] shadow-md hover:shadow-lg
                    transition-all duration-200">

      {/* Header */}
      <div className="border-b border-[#b0121c] px-4 py-2">
        <h1 className="text-sm font-semibold text-[#6d0a10]">
          Overdue Tasks
        </h1>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">

        {loading && (
          <p className="text-sm text-gray-600">Loading…</p>
        )}

        {!loading && topOverdueTasks.length === 0 && (
          <p className="text-sm text-gray-600 text-center">
            No overdue tasks
          </p>
        )}

        {!loading && topOverdueTasks.map(task => (
          <div
            key={task._id}
            className="rounded-lg border border-[#b0121c]
                       bg-white shadow-sm p-2"
          >
            <h2 className="text-sm font-semibold text-[#4b0b10]">
              {task.title}
            </h2>

            <div className="flex justify-between mt-1">

              <p className="text-xs font-medium text-[#b0121c]">
                {task.priority} priority
              </p>

              <p className="text-xs font-semibold text-[#d21320]">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
