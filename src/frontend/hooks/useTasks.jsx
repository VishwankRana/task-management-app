import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export default function useTasks() {
  const { isAuthenticated, loading: authLoading, user, sessionVersion } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/taskmanager/tasks", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch tasks (${res.status})`);
      }

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (authLoading) return;
    fetchTasks();
  }, [authLoading, isAuthenticated, user?.id, sessionVersion, fetchTasks]);

  const now = new Date();

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const due = new Date(task.dueDate);

    return (
      due < now &&
      task.status !== "Completed" &&
      task.status !== "Cancelled"
    );
  });

  const totalTasks = tasks.length;

  const inProgressTasks = tasks.filter((t) => t.status === "In-progress");

  const completedTasks = tasks.filter((t) => t.status === "Completed");

  return {
    tasks,
    loading,
    overdueTasks,
    inProgressTasks,
    completedTasks,
    totalTasks,
    refetchTasks: fetchTasks,
  };
}
