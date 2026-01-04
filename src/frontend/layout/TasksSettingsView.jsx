import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import ProjectStatusMenu from "../components/ProjectStatus";
import ProjectPriorityMenu from "../components/ProjectPriority";

export default function TasksSettingsView({ projectId }) {

  const id = projectId;

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPriority, setProjectPriority] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");

  useEffect(() => {

    axios
      .get(`http://localhost:3000/api/taskmanager/projects/${id}`)
      .then(res => {
        const p = res.data;

        setProjectName(p.projectName || "");
        setProjectDescription(p.projectDescription || "");
        setProjectStatus(p.projectStatus || "");
        setProjectPriority(p.projectPriority || "");

        if (p.projectStartDate) {
          setProjectStartDate(new Date(p.projectStartDate).toISOString().split("T")[0]);
        }

        if (p.projectEndDate) {
          setProjectEndDate(new Date(p.projectEndDate).toISOString().split("T")[0]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err.response?.data || err.message);
      });

  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:3000/api/taskmanager/projects/${id}`,
        {
          projectName,
          projectDescription,
          projectPriority,
          projectStatus,
          projectStartDate: projectStartDate ? new Date(projectStartDate) : null,
          projectEndDate: projectEndDate ? new Date(projectEndDate) : null
        }
      );

      console.log("Project Details Updated Successfully");
    }
    catch (err) {
      console.error("Update error:", err.response?.data || err.message);
    }
  };


  return (
    <div className="flex w-284 justify-center my-5">

      <div className="w-180 rounded-2xl border border-[#d6d3cd] bg-white shadow-sm p-6">

        {/* Header */}
        <h1 className="text-2xl font-extrabold text-[#1D3557] mb-4">
          Project Details
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>

            <input
              type="text"
              id="projectName"
              className="w-full p-2 mt-1 rounded-lg border border-[#c8c6b8]
                         bg-[#f7f6f1] focus:outline-none focus:ring-2 focus:ring-[#d97757]"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              id="description"
              rows={3}
              className="w-full p-2 mt-1 rounded-lg border border-[#c8c6b8]
                         bg-[#f7f6f1] focus:outline-none focus:ring-2 focus:ring-[#d97757]"
              placeholder="Describe your project"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>

          {/* Status + Priority */}
          <div className="flex justify-between">

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <ProjectStatusMenu projectStatus={projectStatus} setProjectStatus={setProjectStatus} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <ProjectPriorityMenu projectPriority={projectPriority} setProjectPriority={setProjectPriority} />
            </div>

          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>

            <input
              type="date"
              className="w-full p-2 mt-1 rounded-lg border border-[#c8c6b8]
                         bg-[#f7f6f1] focus:outline-none focus:ring-2 focus:ring-[#d97757]"
              value={projectStartDate}
              onChange={(e) => setProjectStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>

            <input
              type="date"
              className="w-full p-2 mt-1 rounded-lg border border-[#c8c6b8]
                         bg-[#f7f6f1] focus:outline-none focus:ring-2 focus:ring-[#d97757]"
              value={projectEndDate}
              onChange={(e) => setProjectEndDate(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#d97757",
                paddingY: "10px",
                borderRadius: "12px",
                "&:hover": { backgroundColor: "#c65d3e" }
              }}
            >
              Save Changes
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
