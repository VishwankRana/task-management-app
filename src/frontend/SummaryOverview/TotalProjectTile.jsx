import useProjects from "../hooks/useProjects";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";

export default function TotalProjectTile_Colorful() {

  const { projects, loading } = useProjects();

  return (
    <div className="w-60 p-5 rounded-2xl border border-[#1d3557] bg-[#e8f0ff] shadow-md hover:shadow-lg transition-all duration-200">

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#1D3557]">
          Total Projects
        </p>

        <span className="p-2 rounded-xl bg-[#1D3557] text-white shadow-sm">
          <FolderOpenRoundedIcon fontSize="small" />
        </span>
      </div>

      <h2 className="text-4xl font-extrabold text-[#1D3557] mt-1">
        {loading ? "…" : projects.length}
      </h2>

      <p className="text-xs font-medium text-[#274c77] mt-1">
        projects in workspace
      </p>

    </div>
  );
}
