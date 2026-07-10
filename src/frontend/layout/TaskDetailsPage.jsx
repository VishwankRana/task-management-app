import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Stack } from "@mui/material";
import TaskDetailsHeader from "../components/taskDetails/TaskDetailsHeader";
import TaskDescriptionCard from "../components/taskDetails/TaskDescriptionCard";
import TaskInfoCard from "../components/taskDetails/TaskInfoCard";
import LiveTimerCard from "../components/taskDetails/LiveTimerCard";
import TaskTimelineCard from "../components/taskDetails/TaskTimelineCard";
import TaskCommentsSection from "../components/taskDetails/TaskCommentsSection";
import EditTaskModal from "../components/EditTaskModal";

export default function TaskDetailsPage() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const fetchTask = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/taskmanager/tasks/${taskId}`);
      setTask(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load task");
      navigate(`/projects/${projectId}/tasks`);
    } finally {
      setLoading(false);
    }
  }, [taskId, projectId, navigate]);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/taskmanager/tasks/${taskId}/history`
      );
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load task timeline");
    } finally {
      setHistoryLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;
    fetchTask();
    fetchHistory();
  }, [taskId, fetchTask, fetchHistory]);

  const handleUpdated = (updatedTask) => {
    setTask((prev) => ({ ...prev, ...updatedTask }));
    fetchHistory();
  };

  if (loading) {
    return (
      <div className="w-full px-6 py-10">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading task details...</p>
      </div>
    );
  }

  if (!task) return null;

  return (
    <Stack spacing={3} alignItems="flex-start" className="w-full pb-8">
      <TaskDetailsHeader
        task={task}
        projectName={task.projectName}
        onBack={() => navigate(`/projects/${projectId}/tasks`)}
        onEdit={() => setEditOpen(true)}
      />

      <div className="w-full px-5 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <TaskDescriptionCard description={task.description} />
          <TaskInfoCard task={task} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <LiveTimerCard task={task} />
          <TaskTimelineCard history={history} loading={historyLoading} />
        </div>

        <TaskCommentsSection taskId={Number(taskId)} taskTitle={task.title} />
      </div>

      <EditTaskModal
        task={task}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={handleUpdated}
      />
    </Stack>
  );
}
