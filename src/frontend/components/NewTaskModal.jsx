import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import toast from "react-hot-toast";
import NewTaskButton from "./NewTaskBtn";
import PrioritySelect from "./PrioritySelect";
import TaskStatusMenu from "./StatusSelect";
import TaskTypeMenu from "./TypeSelect";
import AssigneeSelect from "./AssigneeSelect";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function NewTaskModal({ setTaskList }) {
  const { isDark } = useTheme();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskType, setTaskType] = useState("");
  const [assigneeId, setAssigneeId] = useState(null);
  const [members, setMembers] = useState([]);

  const { projectId } = useParams();

  useEffect(() => {
    if (!open || !isAdmin || !projectId) return;

    axios
      .get(`http://localhost:3000/api/taskmanager/projects/${projectId}`)
      .then((res) => setMembers(res.data.members ?? []))
      .catch((err) => console.error(err));
  }, [open, isAdmin, projectId]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setPriority("");
    setStatus("");
    setDueDate("");
    setTaskType("");
    setAssigneeId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }
    if (!priority) {
      alert("Please select a priority");
      return;
    }
    if (!status) {
      alert("Please select a status");
      return;
    }

    if (!taskType) {
      alert("Please select a task type");
      return;
    }

    if (!dueDate) {
      alert("Please select a due date");
      return;
    }

    const TaskData = {
      title: title.trim(),
      description,
      priority,
      status,
      type: taskType,
      dueDate,
      ...(isAdmin && assigneeId ? { assigneeId } : {}),
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/api/taskmanager/projects/${projectId}/tasks`,
        TaskData
      );
      setTaskList((prev) => [...prev, response.data]);
      toast("Task added", {
        icon: <AddCircleIcon sx={{ color: "#1d3652", fontSize: "1.1rem" }} />,
        style: {
          background: "#e8eef5",
          color: "#1d3652",
          border: "1px solid #a8bdd4",
          borderRadius: "12px",
          fontWeight: 600,
        },
      });
      handleClose();
    } catch (err) {
      console.error("Error creating task:", err.message);
      const errorMessage = err.response?.data?.message || err.message;
      toast(`Failed to add task: ${errorMessage}`, {
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

  const inputCls = `w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-[#263446] text-gray-800 dark:text-white border-gray-300 dark:border-slate-600 placeholder-black dark:placeholder-black`;
  const labelCls = `font-medium text-gray-700 dark:text-slate-300`;

  return (
    <>
      <NewTaskButton onClick={handleOpen} />
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
          <div className="w-[450px] bg-white dark:bg-[#1e293b] shadow-xl rounded-xl p-6 border border-gray-200 dark:border-slate-700 mx-auto">
            <div className="w-full flex items-center justify-between">
              <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-slate-100">
                Create a New Task
              </h1>
              <IconButton onClick={handleClose} sx={{ color: isDark ? "#94a3b8" : undefined }}>
                <CloseIcon />
              </IconButton>
            </div>

            <form onSubmit={handleSubmit}>
              <div>
                <div>
                  <label htmlFor="taskName" className={`block ${labelCls}`}>Task Name</label>
                  <input
                    type="text"
                    id="taskName"
                    className={inputCls}
                    placeholder="Enter Task name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="description" className={`block ${labelCls}`}>Description</label>
                  <input
                    type="text"
                    id="description"
                    className={inputCls}
                    placeholder="Describe your task"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className={labelCls}>Status</label>
                    <TaskStatusMenu status={status} setStatus={setStatus} />
                  </div>

                  <div>
                    <label className={labelCls}>Priority</label>
                    <PrioritySelect priority={priority} setPriority={setPriority} />
                  </div>

                  <div>
                    <label className={labelCls}>Type</label>
                    <TaskTypeMenu taskType={taskType} setTaskType={setTaskType} />
                  </div>

                  <div>
                    <label className={labelCls}>Due Date</label>
                    <input
                      type="date"
                      id="DueDate"
                      className={inputCls}
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>

                  {isAdmin && (
                    <div className="col-span-2">
                      <label className={labelCls}>Assign To</label>
                      <AssigneeSelect
                        assigneeId={assigneeId}
                        setAssigneeId={setAssigneeId}
                        members={members}
                      />
                    </div>
                  )}
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
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
