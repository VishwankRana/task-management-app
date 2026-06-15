import { useState } from "react";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EditTaskModal from "../components/EditTaskModal";
import { useTheme } from "../context/ThemeContext";

export default function TaskTile({ task, onDelete, setTaskList }) {
  const { isDark } = useTheme();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const priorityClass = () => {
    switch (task?.priority) {
      case "Low":    return "bg-[#dbeafe] text-[#1e3a8a] border border-[#93c5fd] dark:bg-blue-500/25 dark:text-blue-200 dark:border-blue-400/50";
      case "Medium": return "bg-[#dcfce7] text-[#14532d] border border-[#86efac] dark:bg-green-500/25 dark:text-green-200 dark:border-green-400/50";
      case "High":   return "bg-[#fef9c3] text-[#713f12] border border-[#fde047] dark:bg-yellow-500/25 dark:text-yellow-200 dark:border-yellow-400/50";
      case "Urgent": return "bg-[#fee2e2] text-[#7f1d1d] border border-[#fca5a5] dark:bg-red-500/25 dark:text-red-200 dark:border-red-400/50";
      default:       return "bg-gray-200 text-gray-700 dark:bg-slate-600/50 dark:text-slate-200";
    }
  };

  const handleUpdated = (updatedTask) => {
    setTaskList(prev =>
      prev.map(t => (t._id || t.id) === (updatedTask._id || updatedTask.id) ? updatedTask : t)
    );
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-[#d1d5db] dark:border-slate-700 bg-white dark:bg-[#263446] shadow-sm hover:shadow-md transition mb-5">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 p-3 items-center">

          {/* Title + Description */}
          <div>
            <p className="font-semibold text-[#1f2937] dark:text-slate-100">{task?.title}</p>
            {task?.description && (
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>

          {/* Priority */}
          <div className="flex justify-center">
            <span className={`${priorityClass()} px-3 py-1 rounded-lg text-sm font-semibold`}>
              {task?.priority}
            </span>
          </div>

          {/* Status */}
          <div className="text-center font-medium text-gray-700 dark:text-slate-300">{task?.status}</div>

          {/* Due Date */}
          <div className="text-center text-gray-700 dark:text-slate-300">{formatDate(task?.dueDate)}</div>

          {/* Type */}
          <div className="text-center font-medium text-gray-700 dark:text-slate-300">{task?.type}</div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <IconButton
              size="small"
              onClick={() => setEditOpen(true)}
              sx={{ color: isDark ? "#e2e8f0" : "#1d3557", "&:hover": { bgcolor: isDark ? "#334155" : "#e8f0ff" } }}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDeleteOpen(true)}
              sx={{ color: "#d97757", "&:hover": { bgcolor: isDark ? "#431407" : "#fee2e2" } }}
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>

      <EditTaskModal
        task={task}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={handleUpdated}
      />

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px", p: 2, width: 480, maxWidth: "95vw", bgcolor: isDark ? "#1e293b" : "#ffffff", color: isDark ? "#f1f5f9" : "inherit" } }}
      >
        <DialogTitle sx={{ textAlign: "center", pt: 3, pb: 1 }}>
          <WarningAmberRoundedIcon sx={{ color: "#d97757", fontSize: "5rem", display: "block", mx: "auto", mb: 1.5 }} />
          <span style={{ fontWeight: 900, fontSize: "1.4rem", color: isDark ? "#f1f5f9" : "#1D3557" }}>Delete Task</span>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", pb: 1 }}>
          <DialogContentText sx={{ color: isDark ? "#94a3b8" : "#4b5563", fontSize: "1rem" }}>
            Are you sure you want to delete{" "}
            <span style={{ fontWeight: 700, color: isDark ? "#e2e8f0" : "#1D3557" }}>"{task?.title}"</span>?
          </DialogContentText>
          <p style={{ color: "#d97757", fontSize: "0.82rem", marginTop: "8px", fontWeight: 600 }}>
            This action cannot be undone.
          </p>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", px: 3, pb: 3, pt: 2, gap: 2 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
              borderRadius: "999px",
              px: 3,
              py: 1,
              borderColor: "#d1d5db",
              color: "#4b5563",
              "&:hover": { borderColor: "#9ca3af", bgcolor: "#f9fafb" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => { onDelete(task._id || task.id); setDeleteOpen(false); }}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
              borderRadius: "999px",
              px: 3,
              py: 1,
              bgcolor: "#d97757",
              boxShadow: "0 4px 10px rgba(217,119,87,0.25)",
              "&:hover": { bgcolor: "#c76546", boxShadow: "0 6px 14px rgba(217,119,87,0.35)" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
