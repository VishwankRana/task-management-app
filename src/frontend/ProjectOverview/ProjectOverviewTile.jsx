import useProjects from '../hooks/useProjects';

export default function ProjectOverviewTile() {

    const { projects, loading } = useProjects();

    const topProjects = projects.slice(0,2)

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

  return (
    <>
      {!loading && topProjects.map(p => (
        <div key={p._id} className="bg-[#f4f6fb] border border-[#d4d9e6] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 mb-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{p.projectName}</h1>
              {p.projectDescription && (
                <p className="text-sm text-gray-600 mt-1 max-w-xl overflow-hidden">
                  {p.projectDescription.length > 120
                    ? `${p.projectDescription.slice(0, 117).trimEnd()}...`
                    : p.projectDescription}
                </p>
              )}
            </div>

            <span className="px-3 py-1 text-xs rounded-full bg-yellow-200 text-yellow-800 font-medium border border-yellow-300">
              {p.projectStatus || 'Planning'}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Deadline:</span> {formatDate(p.projectEndDate)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}