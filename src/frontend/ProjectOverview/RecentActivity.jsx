import RecentActivityTile from "./RecentActivityTile";

export default function RecentActivity() {
  return (
    <div className="h-[23em] w-full min-w-0 flex flex-col rounded-2xl border border-[#1f4d63] dark:border-teal-700/50 bg-[#e8f4ff] dark:bg-[#1e293b] shadow-md hover:shadow-lg transition-all duration-200">

      <div className="shrink-0 h-14 px-4 border-b border-[#1f4d63] dark:border-teal-700/50 flex items-center gap-2">
        <h1 className="text-base font-semibold text-[#1f4d63] dark:text-teal-300">
          Recent Activity
        </h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <RecentActivityTile />
      </div>
    </div>
  );
}
