import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ErrorIcon from "@mui/icons-material/Error";
import axios from "axios";
import toast from "react-hot-toast";
import ProjectStatusMenu from "./ProjectStatus";
import ProjectPriorityMenu from "./ProjectPriority";

export default function ProjectSettingsModal({ open, onClose, projectId }) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPriority, setProjectPriority] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");

  useEffect(() => {
    if (!open || !projectId) return;

    axios
      .get(`http://localhost:3000/api/taskmanager/projects/${projectId}`)
      .then((res) => {
        const p = res.data;
        setProjectName(p.projectName || "");
        setProjectDescription(p.projectDescription || "");
        setProjectStatus(p.projectStatus || "");
        setProjectPriority(p.projectPriority || "");
        setProjectStartDate(p.projectStartDate ? new Date(p.projectStartDate).toISOString().split("T")[0] : "");
        setProjectEndDate(p.projectEndDate ? new Date(p.projectEndDate).toISOString().split("T")[0] : "");
      })
      .catch((err) => console.error("Fetch error:", err.response?.data || err.message));
  }, [open, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/taskmanager/projects/${projectId}`, {
        projectName,
        projectDescription,
        projectPriority,
        projectStatus,
        projectStartDate: projectStartDate ? new Date(projectStartDate) : null,
        projectEndDate: projectEndDate ? new Date(projectEndDate) : null,
      });
      toast("Project updated", {
        icon: <SettingsRoundedIcon sx={{ color: "#1d3652", fontSize: "1.1rem" }} />,
        style: {
          background: "#e8eef5",
          color: "#1d3652",
          border: "1px solid #a8bdd4",
          borderRadius: "12px",
          fontWeight: 600,
        },
      });
      onClose();
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      toast("Failed to save project settings", {
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: "20px", width: 500, maxWidth: "95vw", p: 1 } }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#d97757]/10 rounded-lg p-2.5">
              <SettingsRoundedIcon sx={{ color: "#d97757", fontSize: "1.5rem" }} />
            </div>
            <div>
              <p className="text-[18px] font-[900] text-[#1D3557] leading-tight">Project Settings</p>
              <p className="text-xs text-gray-400 leading-none mt-0.5">Edit project details</p>
            </div>
          </div>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <form id="project-settings-form" onSubmit={handleSubmit} className="space-y-3 mt-1">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg border border-[#c8c6b8] bg-[#f7f6f1] focus:outline-none focus:ring-2 focus:ring-[#d97757]"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full p-2 rounded-lg border border-[#c8c6b8] bg-[#f7f6f1] focus:outline-none focus:ring-2 focus:ring-[#d97757]"
              placeholder="Describe your project"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <ProjectStatusMenu projectStatus={projectStatus} setProjectStatus={setProjectStatus} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <ProjectPriorityMenu projectPriority={projectPriority} setProjectPriority={setProjectPriority} />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                className="w-full p-2 rounded-lg border border-[#c8c6b8] bg-[#f7f6f1] focus:outline-none focus:ring-2 focus:ring-[#d97757]"
                value={projectStartDate}
                onChange={(e) => setProjectStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                className="w-full p-2 rounded-lg border border-[#c8c6b8] bg-[#f7f6f1] focus:outline-none focus:ring-2 focus:ring-[#d97757]"
                value={projectEndDate}
                onChange={(e) => setProjectEndDate(e.target.value)}
              />
            </div>
          </div>

        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "999px",
            px: 3,
            borderColor: "#d1d5db",
            color: "#4b5563",
            "&:hover": { borderColor: "#9ca3af", bgcolor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="project-settings-form"
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "999px",
            px: 3,
            bgcolor: "#d97757",
            boxShadow: "0 4px 10px rgba(217,119,87,0.25)",
            "&:hover": { bgcolor: "#c76546", boxShadow: "0 6px 14px rgba(217,119,87,0.35)" },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
