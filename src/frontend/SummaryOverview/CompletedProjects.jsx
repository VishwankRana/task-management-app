import useProjects from "../hooks/useProjects";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function CompletedProjects() {

  const { projects, loading, completedProjects } = useProjects();

  return (
    <div className="w-70 p-5 rounded-2xl border border-[#2a7a35] dark:border-green-500/60 bg-[#e9f7ec] dark:bg-green-500/15 shadow-md hover:shadow-lg transition-all duration-200">

      <div className="flex items-center justify-between">
        <p className="text-l font-semibold text-[#245d2c] dark:text-green-200">
          Completed Projects
        </p>

        <span className="p-2 rounded-xl bg-[#2a7a35] dark:bg-green-600 text-white shadow-sm">
          <CheckCircleRoundedIcon fontSize="small" />
        </span>
      </div>

      <h2 className="text-4xl font-extrabold text-[#1c4d23] dark:text-white">
        {loading ? "…" : completedProjects.length}
      </h2>

      <p className="text-xs font-medium text-[#245d2c] dark:text-green-300 mt-1">
        of {loading ? "…" : projects.length} total
      </p>

    </div>
  );
}
