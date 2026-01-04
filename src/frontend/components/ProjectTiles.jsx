import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProjectTiles() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/taskmanager/projects")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                    gap-6 w-full">
      {projects.map(project => (
        <Link
          key={project._id}
          to={`/projects/${project._id}/tasks`}
        >
          <div
            className="h-40 w-full rounded-2xl border 
                       border-[#1d3557] bg-[#e8f0ff]
                       p-4 shadow-sm hover:shadow-lg
                       hover:-translate-y-0.5
                       transition-all duration-200 flex flex-col justify-between"
          >

            {/* Title + Description */}
            <div>
              <h1 className="text-lg font-bold text-[#1D3557]">
                {project.projectName}
              </h1>

              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                {project.projectDescription || "No description"}
              </p>
            </div>

            {/* Footer Meta */}
            <div className="flex justify-between items-center mt-2">

              <span className="px-3 py-1 text-xs font-semibold 
                               rounded-full bg-white text-[#1d3557]
                               border border-[#1d3557]">
                {project.projectStatus || "Planning"}
              </span>

              <span className="text-xs font-bold text-[#1d3557]">
                {project.projectPriority} Priority
              </span>

            </div>

          </div>
        </Link>
      ))}
    </div>
  );
}
