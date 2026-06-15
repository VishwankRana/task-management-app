import RecentActivityTile from "./RecentActivityTile";

export default function RecentActivity() {
  return (
    <div className="min-h-[23em] w-[55em] flex flex-col
                    rounded-2xl border border-[#1f4d63] dark:border-teal-700/50
                    bg-[#e8f4ff] dark:bg-[#1e293b]
                    shadow-md hover:shadow-lg
                    transition-all duration-200 mt-8">

      <div className="p-3 border-b border-[#1f4d63] dark:border-teal-700/50 flex justify-between items-center">
        <h1 className="text-[20px] font-semibold text-[#1f4d63] dark:text-teal-300">
          Recent Activity
        </h1>
      </div>

      <div className="w-full h-full p-3">
        <RecentActivityTile />
      </div>
    </div>
  );
}
