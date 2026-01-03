import useProjects from "../hooks/useProjects";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function CompletedProjects() {

  const { projects, loading, completedProjects } = useProjects();

  return (
    <div className="w-60 p-5 rounded-2xl border border-[#2a7a35] bg-[#e9f7ec] shadow-md hover:shadow-lg transition-all duration-200">

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#245d2c]">
          Completed Projects
        </p>

        <span className="p-2 rounded-xl bg-[#2a7a35] text-white shadow-sm">
          <CheckCircleRoundedIcon fontSize="small" />
        </span>
      </div>

      <h2 className="text-4xl font-extrabold text-[#1c4d23]">
        {loading ? "…" : completedProjects.length}
      </h2>

      <p className="text-xs font-medium text-[#245d2c] mt-1">
        of {loading ? "…" : projects.length} total
      </p>

    </div>
  );
}
