import useProjects from "../hooks/useProjects";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

export default function InProgressProjectsTile() {
  const { projects, loading, inProgressProjects } = useProjects();

  return (
    <div className="w-70 p-5 rounded-2xl border border-[#d97757] dark:border-orange-500/60 bg-[#fff5ee] dark:bg-orange-500/15 shadow-md hover:shadow-lg transition-all duration-200">

      <div className="flex items-center justify-between">
        <p className="text-l font-semibold text-[#9a3412] dark:text-orange-200">
          In Progress
        </p>

        <span className="p-2 rounded-xl bg-[#d97757] dark:bg-orange-500 text-white shadow-sm">
          <AutorenewRoundedIcon fontSize="small" />
        </span>
      </div>

      <h2 className="text-4xl font-extrabold text-[#7c2d12] dark:text-white mt-1">
        {loading ? "…" : inProgressProjects.length}
      </h2>

      <p className="text-xs font-medium text-[#9a3412] dark:text-orange-300 mt-1">
        of {loading ? "…" : projects.length} total
      </p>

    </div>
  );
}
