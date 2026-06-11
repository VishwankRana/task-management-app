import { Link } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";

const STATUS_STYLES = {
  "Planning":    "bg-blue-100 text-blue-700",
  "Active":      "bg-green-100 text-green-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  "Completed":   "bg-gray-100 text-gray-500",
  "On Hold":     "bg-orange-100 text-orange-700",
  "Cancelled":   "bg-red-100 text-red-600",
};

const PRIORITY_STYLES = {
  "High":   "bg-red-100 text-red-600",
  "Medium": "bg-yellow-100 text-yellow-700",
  "Low":    "bg-green-100 text-green-700",
};

const PRIORITY_ACCENT = {
  "High":   "border-t-red-400",
  "Medium": "border-t-yellow-400",
  "Low":    "border-t-green-400",
};

export default function ProjectTiles() {
  const { projects } = useProject();

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-[#e8f0ff] rounded-full p-6 mb-4">
          <FolderOpenRoundedIcon sx={{ fontSize: "3rem", color: "#1D3557" }} />
        </div>
        <h2 className="text-xl font-bold text-[#1D3557] mb-1">No projects yet</h2>
        <p className="text-sm text-gray-500">
          Click "New Project" above to create your first project.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {projects.map((project) => {
        const priority = project.projectPriority || "";
        const status = project.projectStatus || "Planning";
        const accentClass = PRIORITY_ACCENT[priority] || "border-t-gray-300";
        const statusClass = STATUS_STYLES[status] || "bg-gray-100 text-gray-500";
        const priorityClass = PRIORITY_STYLES[priority] || "bg-gray-100 text-gray-500";

        return (
          <Link key={project._id} to={`/projects/${project._id}/tasks`}>
            <div
              className={`
                min-h-40 w-full rounded-2xl border border-[#1d3557]/20
                border-t-4 ${accentClass}
                bg-white p-4 shadow-sm
                hover:shadow-lg hover:-translate-y-1
                transition-all duration-200 flex flex-col justify-between
              `}
            >
              {/* Title + Description */}
              <div>
                <h2 className="text-base font-bold text-[#1D3557] leading-snug">
                  {project.projectName}
                </h2>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {project.projectDescription || "No description"}
                </p>
              </div>

              {/* Footer badges */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusClass}`}
                >
                  {status}
                </span>

                {priority && (
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${priorityClass}`}
                  >
                    {priority} Priority
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
