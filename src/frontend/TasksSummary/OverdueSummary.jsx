import useTasks from "../hooks/useTasks";

export default function OverdueSummary() {

  const { overdueTasks, loading } = useTasks();

  const topOverdueTasks = overdueTasks
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // nearest overdue first
    .slice(0, 2);

  return (
    <div className="bg-[#F2EBCA] border-2 border-black w-[20em] rounded-xl">

      <div className="border-b-2 border-black">
        <h1 className="pl-5 py-1 font-semibold text-black">
          Overdue Tasks
        </h1>
      </div>

      <div className="p-2 space-y-2">

        {loading && <p>Loading…</p>}

        {!loading && topOverdueTasks.length === 0 && (
          <p className="text-sm text-gray-600 text-center">
            No overdue tasks
          </p>
        )}

        {!loading && topOverdueTasks.map(task => (
          <div
            key={task._id}
            className="bg-[#cbc499] rounded-md p-2 border border-black"
          >
            <h2 className="text-sm font-medium">
              {task.title}
            </h2>

            <div className="flex justify-between">
            <p className="text-xs text-gray-700">
              {task.priority} priority
            </p>

            <p className="text-xs text-red-700">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}