import useProjects from "../hooks/useProjects";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

export default function InProgressProjectsTile() {
  const { projects, loading, inProgressProjects } = useProjects();

  return (
    <div className="w-70 p-5 rounded-2xl border border-[#d97757] bg-[#fff5ee] shadow-md hover:shadow-lg transition-all duration-200">

      <div className="flex items-center justify-between">
        <p className="text-l font-semibold text-[#9a3412]">
          In Progress
        </p>

        <span className="p-2 rounded-xl bg-[#d97757] text-white shadow-sm">
          <AutorenewRoundedIcon fontSize="small" />
        </span>
      </div>

      <h2 className="text-4xl font-extrabold text-[#7c2d12] mt-1">
        {loading ? "…" : inProgressProjects.length}
      </h2>

      <p className="text-xs font-medium text-[#9a3412] mt-1">
        of {loading ? "…" : projects.length} total
      </p>

    </div>
  );
}
