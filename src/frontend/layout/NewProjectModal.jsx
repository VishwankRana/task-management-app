import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import { useProject } from "../context/ProjectContext"; 

export default function NewProjectModal() {
  const { openNewPrjModal, setOpenNewPrjModal, setProjects } = useProject();

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [projectPriority, setProjectPriority] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");

  const resetFormAndClose = () => {
    setProjectName("");
    setProjectDescription("");
    setProjectStatus("");
    setProjectPriority("");
    setProjectStartDate("");
    setProjectEndDate("");
    setOpenNewPrjModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      projectName,
      projectDescription,
      projectStatus,
      projectPriority,
      projectStartDate: projectStartDate ? dayjs(projectStartDate).toISOString() : null,
      projectEndDate: projectEndDate ? dayjs(projectEndDate).toISOString() : null,
    };

    try {
      const res = await fetch("http://localhost:3000/api/taskmanager/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const body = await (async () => {
        try {
          return await res.json();
        } catch {
          return await res.text();
        }
      })();

      if (!res.ok) {
        console.error("server error:", body);
        throw new Error(body?.message || body || res.statusText);
      }

      console.log("Project saved!!", body);

      if (typeof setProjects === "function") {
        setProjects((prev) => [...prev, body]);
      } else {
        console.warn("setProjects is not a function — skipping local update", setProjects);
      }

      resetFormAndClose();
    } catch (err) {
      console.error("❌ Error submitting form:", err?.message ?? err);
    }
  };

  if (!openNewPrjModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-[450px] bg-white shadow-xl rounded-xl p-6 border border-gray-200 mx-auto">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">Create a New Project</h1>
          <IconButton onClick={resetFormAndClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="projectName" className="block font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            className="w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <label htmlFor="description" className="block font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            className="w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Describe your project"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />

          <label htmlFor="status" className="block font-medium text-gray-700">
            Status
          </label>
          <input
            type="text"
            id="status"
            className="w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Status of your project"
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
          />

          <label htmlFor="priority" className="block font-medium text-gray-700">
            Priority
          </label>
          <input
            type="text"
            id="priority"
            className="w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Priority of your project"
            value={projectPriority}
            onChange={(e) => setProjectPriority(e.target.value)}
          />

          <label htmlFor="StartDate" className="block font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="StartDate"
            className="w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={projectStartDate}
            onChange={(e) => setProjectStartDate(e.target.value)}
          />

          <label htmlFor="EndDate" className="block font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="EndDate"
            className="w-full p-2 border rounded-lg mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={projectEndDate}
            onChange={(e) => setProjectEndDate(e.target.value)}
          />

          <div className="flex justify-end w-full">
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#db7657",
                paddingY: "12px",
                "&:hover": { backgroundColor: "#c65d3e" },
              }}
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
