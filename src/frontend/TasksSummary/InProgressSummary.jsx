import useTasks from "../hooks/useTasks";

export default function InProgressSummary() {

  const { inProgressTasks, loading } = useTasks();

  const topInProgressTasks = inProgressTasks.slice(0, 2);

  return (
    <div className="bg-[#F2EBCA] border-2 border-black w-[20em] rounded-xl">

      <div className="border-b-2 border-black">
        <h1 className="pl-5 py-1 font-semibold">In Progress</h1>
      </div>

      <div className="p-2 space-y-2 ">

        {loading && <p>Loading...</p>}

        {!loading && topInProgressTasks.length === 0 && (
          <p className="text-sm text-gray-600 text-center">
            No tasks in progress
          </p>
        )}

        {!loading && topInProgressTasks.map(task => (
          <div
            key={task._id}
            className="bg-[#cbc499] rounded-md p-2 border border-black"
          >
            <h2 className="text-sm font-medium">
              {task.title}
            </h2>

            <p className="text-xs text-gray-700">
              {task.priority} priority
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}
