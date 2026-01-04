import StatusTaskChart from "../components/StatusTaskChart";
import PriorityPieChart from "../components/PriorityPieChart";

export default function TasksAnalyticsView({ taskList = [] }) {

  return (
    <div className="w-full space-y-4 py-5">

      {/* Page Title */}
      <h1 className="text-3xl font-extrabold text-[#1D3557]">
        Analytics
      </h1>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

        {/* Status Chart */}
        <div className="rounded-2xl border border-[#d6d3cd] bg-white shadow-sm p-4">

          <h2 className="text-lg font-semibold text-[#b4530d] mb-2">
            Tasks by Status
          </h2>

          <div className="h-88 flex items-center justify-center">
            <StatusTaskChart taskList={taskList} />
          </div>
        </div>

        {/* Priority Chart */}
        <div className="rounded-2xl border border-[#d6d3cd] bg-white shadow-sm p-4">

          <h2 className="text-lg font-semibold text-[#b4530d] mb-2">
            Tasks by Priority
          </h2>

          <div className="flex items-center justify-center">
            <PriorityPieChart taskList={taskList} />
          </div>
        </div>

      </div>
    </div>
  );
}
