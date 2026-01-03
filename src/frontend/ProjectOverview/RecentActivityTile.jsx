import useTasks from "../hooks/useTasks";


export default function RecentActivityTile() {

    const { tasks, loading } = useTasks();

    const topTasks = tasks.slice(0,3)

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

  return (
    <>
      {!loading && topTasks.map(t => (
        <div key={t._id} className="bg-[#f3f0df] border border-[#d6d2b4] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 mb-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{t.title}</h1>
              {t.description && (
                <p className="text-sm text-gray-600 mt-1 max-w-xl overflow-hidden">
                  {t.description.length > 120
                    ? `${t.description.slice(0, 117).trimEnd()}...`
                    : t.description}
                </p>
              )}
            </div>

            <span className="px-3 py-1 text-xs rounded-full bg-yellow-200 text-yellow-800 font-medium border border-yellow-300">
              {t.status || 'Pending'}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Created at:</span> {formatDate(t.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}