export default function TaskTile({ task }) {
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const priorityClass = () => {
    switch (task?.priority) {
      case "Low":
        return "bg-[#dbeafe] text-[#1e3a8a] border border-[#93c5fd]";
      case "Medium":
        return "bg-[#dcfce7] text-[#14532d] border border-[#86efac]";
      case "High":
        return "bg-[#fef9c3] text-[#713f12] border border-[#fde047]";
      case "Urgent":
        return "bg-[#fee2e2] text-[#7f1d1d] border border-[#fca5a5]";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-[#d1d5db] bg-white shadow-sm hover:shadow-md transition mb-5">
        {/* Row */}
        <div
          className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr]
                        gap-4 p-3 items-center"
        >
          {/* Title + Description */}
          <div>
            <p className="font-semibold text-[#1f2937]">{task?.title}</p>

            {task?.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="flex justify-center">
            <span
              className={`${priorityClass()} px-3 py-1 rounded-lg text-sm font-semibold`}
            >
              {task?.priority}
            </span>
          </div>

          {/* Status */}
          <div className="text-center font-medium text-gray-700">
            {task?.status}
          </div>

          {/* Due Date */}
          <div className="text-center text-gray-700">
            {formatDate(task?.dueDate)}
          </div>

          {/* Type */}
          <div className="text-center font-medium text-gray-700">
            {task?.type}
          </div>
        </div>
      </div>
    </div>
  );
}
