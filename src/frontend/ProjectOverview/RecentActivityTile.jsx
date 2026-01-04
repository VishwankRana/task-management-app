import useTasks from "../hooks/useTasks";

export default function RecentActivityTile() {

  const { tasks, loading } = useTasks();

  const topTasks = tasks.slice(0, 3);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // 🎨 Status → Badge Color Mapping
  const statusBadgeClass = (status) => {
    switch (status) {

      case "Completed":
        return "bg-green-100 text-green-800 border border-green-300";

      case "In-progress":
        return "bg-orange-100 text-orange-800 border border-orange-300";

      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";

      case "On Hold":
        return "bg-blue-100 text-blue-800 border border-blue-300";

      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-300";

      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  return (
    <>
      {!loading &&
        topTasks.map((t) => (
          <div
            key={t._id}
            className="bg-[#f4f6fb] border border-[#d4d9e6]
                       rounded-2xl p-4 shadow-sm hover:shadow-md
                       transition-shadow duration-200 mb-3"
          >
            <div className="flex items-start justify-between">

              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {t.title}
                </h1>

                {t.description && (
                  <p className="text-sm text-gray-600 mt-1 max-w-xl overflow-hidden">
                    {t.description.length > 120
                      ? `${t.description.slice(0, 117).trimEnd()}...`
                      : t.description}
                  </p>
                )}
              </div>

              {/* 🟢 Status Badge */}
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium shadow-sm
                            ${statusBadgeClass(t.status)}`}
              >
                {t.status || "Pending"}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Created:</span>{" "}
                {formatDate(t.createdAt)}
              </p>
            </div>
          </div>
        ))}
    </>
  );
}
