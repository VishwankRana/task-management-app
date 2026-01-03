export default function ProjectOverviewTile() {
  return (
    <div className="bg-[#f3f0df] border border-[#d6d2b4] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 mb-3">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Task Manager App
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            A web app that manages tasks with deadlines and priorities
          </p>
        </div>

        <span className="px-3 py-1 text-xs rounded-full bg-yellow-200 text-yellow-800 font-medium border border-yellow-300">
          Planning
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Deadline:</span> Jan 14, 2026
        </p>

        <button className="text-sm px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
          View Details
        </button>
      </div>
    </div>
  );
}