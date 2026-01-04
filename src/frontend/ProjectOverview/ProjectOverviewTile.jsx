import useProjects from '../hooks/useProjects';

export default function ProjectOverviewTile() {

  const { projects, loading } = useProjects();

  const topProjects = projects.slice(0, 2);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const statusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border border-green-300";
      case "In-progress":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      case "Planning":
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
        topProjects.map((p) => (
          <div
            key={p._id}
            className="bg-[#f4f6fb] border border-[#d4d9e6] rounded-2xl
                       p-4 shadow-sm hover:shadow-md transition-shadow duration-200 mb-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {p.projectName}
                </h1>

                {p.projectDescription && (
                  <p className="text-sm text-gray-600 mt-1 max-w-xl overflow-hidden">
                    {p.projectDescription.length > 120
                      ? `${p.projectDescription.slice(0, 117).trimEnd()}...`
                      : p.projectDescription}
                  </p>
                )}
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium
                            ${statusBadgeClass(p.projectStatus)}`}
              >
                {p.projectStatus || "Planning"}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Deadline:</span>{" "}
                {formatDate(p.projectEndDate)}
              </p>
            </div>
          </div>
        ))}
    </>
  );
}
