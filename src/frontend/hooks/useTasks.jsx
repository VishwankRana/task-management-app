import { useEffect, useState } from "react";

export default function useTasks() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/taskmanager/tasks")
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      });
  }, []);

  const now = new Date();

  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;

    const due = new Date(task.dueDate);

    return (
      due < now &&
      task.status !== "Completed" &&
      task.status !== "Cancelled"
    );
  });

  const totalTasks = tasks.length;

  const inProgressTasks = tasks.filter(t => t.status === "In-progress");

  const completedTasks = tasks.filter(t => t.status === "Completed");

  return {
    tasks,
    loading,
    overdueTasks,
    inProgressTasks,
    completedTasks,
    totalTasks
  };
}

