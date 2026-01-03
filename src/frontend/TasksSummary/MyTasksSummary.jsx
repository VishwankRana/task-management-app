import useTasks from "../hooks/useTasks";

export default function MyTasksSummary() {

  const { tasks, loading } = useTasks();
  const topTasks = tasks.slice(0, 2);

  return (
    <div className="w-[20em] rounded-2xl border border-[#3a2f7a]
                    bg-[#efefff] shadow-md hover:shadow-lg
                    transition-all duration-200 mb-2">

      {/* Header */}
      <div className="border-b border-[#3a2f7a] px-4 py-2">
        <h1 className="text-sm font-semibold text-[#2a245c]">
          My Tasks
        </h1>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">

        {loading && <p className="text-sm text-gray-600">Loading…</p>}

        {!loading && topTasks.length === 0 && (
          <p className="text-sm text-gray-600">
            No tasks assigned
          </p>
        )}

        {!loading && topTasks.map(task => (
          <div
            key={task._id}
            className="rounded-lg border border-[#3a2f7a]
                       bg-white shadow-sm p-2"
          >
            <h2 className="text-sm font-semibold text-[#1f1b4d]">
              {task.title}
            </h2>

            <p className="text-xs font-medium text-[#4b3fb8]">
              {task.priority} priority
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}
