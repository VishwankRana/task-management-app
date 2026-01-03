import useTasks from "../hooks/useTasks";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";

export default function MyTasksTile() {

  const { totalTasks, loading } = useTasks();

  return (
    <div className="w-60 p-5 rounded-2xl border border-[#343a8d] bg-[#e9ecff] shadow-md hover:shadow-lg transition-all duration-200">

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#2a2f75]">
          My Tasks
        </p>

        <span className="p-2 rounded-xl bg-[#343a8d] text-white shadow-sm">
          <AssignmentTurnedInRoundedIcon fontSize="small" />
        </span>
      </div>

      <h2 className="text-4xl font-extrabold text-[#1f2463] mt-1">
        {loading ? "…" : totalTasks}
      </h2>

      <p className="text-xs font-medium text-[#2a2f75] mt-1">
        assigned to me
      </p>

    </div>
  );
}
