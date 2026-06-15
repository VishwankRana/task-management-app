import useProjects from "../hooks/useProjects";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";

export default function TotalProjectTile_Colorful() {

  const { projects, loading } = useProjects();

  return (
    <div className="w-70 p-5 rounded-2xl border border-[#1d3557] dark:border-blue-500/60 bg-[#e8f0ff] dark:bg-blue-500/15 shadow-md hover:shadow-lg transition-all duration-200">

      <div className="flex items-center justify-between">
        <p className="text-l font-semibold text-[#1D3557] dark:text-blue-200">
          Total Projects
        </p>

        <span className="p-2 rounded-xl bg-[#1D3557] dark:bg-blue-600 text-white shadow-sm">
          <FolderOpenRoundedIcon fontSize="small" />
        </span>
      </div>

      <h2 className="text-4xl font-extrabold text-[#1D3557] dark:text-white mt-1">
        {loading ? "…" : projects.length}
      </h2>

      <p className="text-xs font-medium text-[#274c77] dark:text-blue-300 mt-1">
        projects in workspace
      </p>

    </div>
  );
}
