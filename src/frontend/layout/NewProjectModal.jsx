import { IconButton } from "@mui/material";
import { useState } from "react";
import { useProject } from "../context/ProjectContext"; 
import ProjectPriorityMenu from "../components/ProjectPriority"
import ProjectStatusMenu from "../components/ProjectStatus";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ErrorIcon from '@mui/icons-material/Error';
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

export default function NewProjectModal() {
  const { openNewPrjModal, setOpenNewPrjModal, setProjects } = useProject();
  const { isDark } = useTheme();

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
        credentials: "include",
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

      if (typeof setProjects === "function") {
        setProjects((prev) => [...prev, body]);
      } else {
        console.warn("setProjects is not a function — skipping local update", setProjects);
      }

      toast("New project added", {
        icon: <AddCircleIcon sx={{ color: "#1d3652", fontSize: "1.1rem" }} />,
        style: {
          background: "#e8eef5",
          color: "#1d3652",
          border: "1px solid #a8bdd4",
          borderRadius: "12px",
          fontWeight: 600,
        },
      });
      resetFormAndClose();
    } catch (err) {
      console.error("❌ Error submitting form:", err?.message ?? err);
      toast("Failed to create project", {
        icon: <ErrorIcon sx={{ color: "#b91c1c", fontSize: "1.1rem" }} />,
        style: {
          background: "#fee2e2",
          color: "#7f1d1d",
          border: "1px solid #fca5a5",
          borderRadius: "12px",
          fontWeight: 600,
        },
      });
    }
  };

  if (!openNewPrjModal) return null;

  const inputCls = `w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-[#263446] text-gray-800 dark:text-white border-gray-300 dark:border-slate-600 placeholder-black dark:placeholder-black`;
  const labelCls = `block font-medium text-gray-700 dark:text-slate-300`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-[450px] bg-white dark:bg-[#1e293b] shadow-xl rounded-xl p-6 border border-gray-200 dark:border-slate-700 mx-auto">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-slate-100">Create a New Project</h1>
          <IconButton onClick={resetFormAndClose} sx={{ color: isDark ? "#94a3b8" : undefined }}>
            <CloseIcon />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label htmlFor="projectName" className={labelCls}>Project Name</label>
              <input
                type="text"
                id="projectName"
                className={inputCls}
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelCls}>Description</label>
              <input
                type="text"
                id="description"
                className={inputCls}
                placeholder="Describe your project"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-between mb-2">
              <div>
                <label htmlFor="status" className={labelCls}>Status</label>
                <ProjectStatusMenu projectStatus={projectStatus} setProjectStatus={setProjectStatus} />
              </div>
              <div>
                <label htmlFor="priority" className={labelCls}>Priority</label>
                <ProjectPriorityMenu projectPriority={projectPriority} setProjectPriority={setProjectPriority} />
              </div>
            </div>

            <div>
              <label htmlFor="StartDate" className={labelCls}>
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="StartDate"
                required
                className={inputCls}
                value={projectStartDate}
                onChange={(e) => setProjectStartDate(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="EndDate" className={labelCls}>
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="EndDate"
                required
                className={`${inputCls} mb-4`}
                value={projectEndDate}
                onChange={(e) => setProjectEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end w-full">
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "999px",
                backgroundColor: "#d97757",
                boxShadow: "0 4px 10px rgba(217,119,87,0.25)",
                "& .MuiSvgIcon-root": { fontSize: "1.2rem" },
                "&:hover": {
                  backgroundColor: "#c76546",
                  boxShadow: "0 6px 14px rgba(217,119,87,0.35)",
                },
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
