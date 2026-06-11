import { useState } from "react";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EditTaskModal from "../components/EditTaskModal";

export default function TaskTile({ task, onDelete, setTaskList }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const priorityClass = () => {
    switch (task?.priority) {
      case "Low":    return "bg-[#dbeafe] text-[#1e3a8a] border border-[#93c5fd]";
      case "Medium": return "bg-[#dcfce7] text-[#14532d] border border-[#86efac]";
      case "High":   return "bg-[#fef9c3] text-[#713f12] border border-[#fde047]";
      case "Urgent": return "bg-[#fee2e2] text-[#7f1d1d] border border-[#fca5a5]";
      default:       return "bg-gray-200 text-gray-700";
    }
  };

  const handleUpdated = (updatedTask) => {
    setTaskList(prev =>
      prev.map(t => (t._id || t.id) === (updatedTask._id || updatedTask.id) ? updatedTask : t)
    );
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-[#d1d5db] bg-white shadow-sm hover:shadow-md transition mb-5">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 p-3 items-center">

          {/* Title + Description */}
          <div>
            <p className="font-semibold text-[#1f2937]">{task?.title}</p>
            {task?.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>

          {/* Priority */}
          <div className="flex justify-center">
            <span className={`${priorityClass()} px-3 py-1 rounded-lg text-sm font-semibold`}>
              {task?.priority}
            </span>
          </div>

          {/* Status */}
          <div className="text-center font-medium text-gray-700">{task?.status}</div>

          {/* Due Date */}
          <div className="text-center text-gray-700">{formatDate(task?.dueDate)}</div>

          {/* Type */}
          <div className="text-center font-medium text-gray-700">{task?.type}</div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <IconButton
              size="small"
              onClick={() => setEditOpen(true)}
              sx={{ color: "#1d3557", "&:hover": { bgcolor: "#e8f0ff" } }}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDeleteOpen(true)}
              sx={{ color: "#b91c1c", "&:hover": { bgcolor: "#fee2e2" } }}
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
        PaperProps={{ sx: { borderRadius: "16px", p: 1, maxWidth: 400 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <WarningAmberRoundedIcon sx={{ color: "#b91c1c", fontSize: "1.8rem" }} />
          <span className="text-[#1f2937] font-bold text-lg">Delete Task?</span>
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "#4b5563", fontSize: "0.9rem" }}>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#1f2937]">"{task?.title}"</span>?
            <br />
            <span className="text-red-600 text-xs mt-1 block">This action cannot be undone.</span>
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: "999px",
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
              borderRadius: "999px",
              bgcolor: "#b91c1c",
              boxShadow: "0 4px 10px rgba(185,28,28,0.25)",
              "&:hover": { bgcolor: "#991b1b" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
