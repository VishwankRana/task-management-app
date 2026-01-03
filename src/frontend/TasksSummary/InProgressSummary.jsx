import useTasks from "../hooks/useTasks";

export default function InProgressSummary() {

  const { inProgressTasks, loading } = useTasks();
  const topInProgressTasks = inProgressTasks.slice(0, 2);

  return (
    <div className="w-[20em] rounded-2xl border border-[#a86214]
                    bg-[#fff3e3] shadow-md hover:shadow-lg
                    transition-all duration-200">

      {/* Header */}
      <div className="border-b border-[#a86214] px-4 py-2">
        <h1 className="text-sm font-semibold text-[#6b420c]">
          In Progress
        </h1>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">

        {loading && <p className="text-sm text-gray-600">Loading...</p>}

        {!loading && topInProgressTasks.length === 0 && (
          <p className="text-sm text-gray-600 text-center">
            No tasks in progress
          </p>
        )}

        {!loading && topInProgressTasks.map(task => (
          <div
            key={task._id}
            className="rounded-lg border border-[#a86214]
                       bg-white shadow-sm p-2"
          >
            <h2 className="text-sm font-semibold text-[#4d3209]">
              {task.title}
            </h2>

            <p className="text-xs font-medium text-[#a86214]">
              {task.priority} priority
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}
