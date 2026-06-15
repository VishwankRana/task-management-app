import { useState, useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import toast from "react-hot-toast";
import PrioritySelect from "./PrioritySelect";
import TaskStatusMenu from "./StatusSelect";
import TaskTypeMenu from "./TypeSelect";
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import dayjs from "dayjs";

export default function EditTaskModal({ task, open, onClose, onUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskType, setTaskType] = useState("");

  useEffect(() => {
    if (task && open) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "");
      setStatus(task.status || "");
      setTaskType(task.type || "");
      setDueDate(task.dueDate ? dayjs(task.dueDate).format("YYYY-MM-DD") : "");
    }
  }, [task, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) { alert("Please enter a task title"); return; }
    if (!priority)      { alert("Please select a priority"); return; }
    if (!status)        { alert("Please select a status"); return; }
    if (!taskType)      { alert("Please select a task type"); return; }
    if (!dueDate)       { alert("Please select a due date"); return; }

    try {
      const id = task._id || task.id;
      const response = await axios.put(
        `http://localhost:3000/api/taskmanager/tasks/${id}`,
        { title: title.trim(), description, priority, status, type: taskType, dueDate }
      );
      onUpdated(response.data);
      toast("Task updated", {
        icon: <EditIcon sx={{ color: "#1d3652", fontSize: "1.1rem" }} />,
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
      console.error("Error updating task:", err.message);
      toast(`Failed to update task: ${err.response?.data?.message || err.message}`, {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
      <div className="w-[450px] bg-white shadow-xl rounded-xl p-6 border border-gray-200 mx-auto">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">Update Task</h1>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label htmlFor="taskName" className="block font-medium text-gray-700">
                Task Name
              </label>
              <input
                type="text"
                id="taskName"
                className="w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter task name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="block font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                className="w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Describe your task"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="font-medium text-gray-700">Status</label>
                <TaskStatusMenu status={status} setStatus={setStatus} />
              </div>

              <div>
                <label className="font-medium text-gray-700">Priority</label>
                <PrioritySelect priority={priority} setPriority={setPriority} />
              </div>

              <div>
                <label className="font-medium text-gray-700">Type</label>
                <TaskTypeMenu taskType={taskType} setTaskType={setTaskType} />
              </div>

              <div>
                <label className="font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  id="DueDate"
                  className="w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
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
                "&:hover": {
                  backgroundColor: "#c76546",
                  boxShadow: "0 6px 14px rgba(217,119,87,0.35)",
                },
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
