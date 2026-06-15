import useProjects from '../hooks/useProjects';

const statusBadgeClass = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 border border-green-300 dark:bg-green-500/25 dark:text-green-200 dark:border-green-400/50";
    case "In-progress":
      return "bg-orange-100 text-orange-800 border border-orange-300 dark:bg-orange-500/25 dark:text-orange-200 dark:border-orange-400/50";
    case "Planning":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-500/25 dark:text-yellow-200 dark:border-yellow-400/50";
    case "On Hold":
      return "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-500/25 dark:text-blue-200 dark:border-blue-400/50";
    case "Cancelled":
      return "bg-red-100 text-red-800 border border-red-300 dark:bg-red-500/25 dark:text-red-200 dark:border-red-400/50";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300 dark:bg-slate-500/25 dark:text-slate-200 dark:border-slate-400/50";
  }
};

export default function ProjectOverviewTile() {
  const { projects, loading } = useProjects();
  const topProjects = projects.slice(0, 2);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <>
      {!loading &&
        topProjects.map((p) => (
          <div
            key={p._id}
            className="bg-[#f4f6fb] dark:bg-[#263446] border border-[#d4d9e6] dark:border-slate-700
                       rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 mb-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  {p.projectName}
                </h1>

                {p.projectDescription && (
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 max-w-xl overflow-hidden">
                    {p.projectDescription.length > 120
                      ? `${p.projectDescription.slice(0, 117).trimEnd()}...`
                      : p.projectDescription}
                  </p>
                )}
              </div>

              <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusBadgeClass(p.projectStatus)}`}>
                {p.projectStatus || "Planning"}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-700 dark:text-slate-300">
                <span className="font-semibold">Deadline:</span>{" "}
                {formatDate(p.projectEndDate)}
              </p>
            </div>
          </div>
        ))}
    </>
  );
}
