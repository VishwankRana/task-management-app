import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import TaskTile from '../layout/TaskTile';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TaskList({ statusFilter = "all" }) {

  const { projectId } = useParams();
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    if (!projectId) return;

    const fetchTaskList = async () => {
      try {
        const taskRes = await axios.get(
          `http://localhost:3000/api/taskmanager/projects/${projectId}/tasks`
        );
        setTaskList(taskRes.data);
      } catch (err) {
        console.error("❌ Failed to fetch Task:", err.message);
      }
    };

    fetchTaskList();
  }, [projectId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/taskmanager/tasks/${id}`
      );
      setTaskList(prev => prev.filter(task => task._id !== id));
      toast("Task removed", {
        icon: <DeleteIcon sx={{ color: "#1d3652", fontSize: "1.1rem" }} />,
        style: {
          background: "#e8eef5",
          color: "#1d3652",
          border: "1px solid #a8bdd4",
          borderRadius: "12px",
          fontWeight: 600,
        },
      });
    } catch (err) {
      console.error("❌ Failed to delete Task:", err.message);
      toast("Failed to remove task", {
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
    <div className="flex justify-center w-full my-6">

      <div className="w-full rounded-2xl border border-[#d6d3cd] dark:border-slate-700
                      bg-white dark:bg-[#1e293b] shadow-sm">

        {/* Header Bar */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]
                        gap-4 px-4 py-2 rounded-t-2xl
                        bg-[#fff1e3] dark:bg-[#3d2510] border-b border-[#c9b5a3] dark:border-orange-900/50">

          <h3 className="font-semibold text-[#3a2b20] dark:text-orange-100">Task</h3>
          <h3 className="font-semibold text-center text-[#3a2b20] dark:text-orange-100">Priority</h3>
          <h3 className="font-semibold text-center text-[#3a2b20] dark:text-orange-100">Status</h3>
          <h3 className="font-semibold text-center text-[#3a2b20] dark:text-orange-100">Due Date</h3>
          <h3 className="font-semibold text-center text-[#3a2b20] dark:text-orange-100">Type</h3>
          <h3 className="font-semibold text-center text-[#3a2b20] dark:text-orange-100">Actions</h3>

        </div>

        {/* Task Rows */}
        <div className="p-3 space-y-3">

          {(() => {
            const filtered = statusFilter === "all"
              ? taskList
              : taskList.filter(t => t.status === statusFilter);

            if (filtered.length === 0) return (
              <div className="text-sm text-gray-600 dark:text-slate-400 text-center py-4">
                {taskList.length === 0 ? "No tasks added yet" : `No ${statusFilter} tasks`}
              </div>
            );

            return filtered.map(task => (
              <TaskTile
                key={task._id || task.id}
                task={task}
                onDelete={handleDelete}
                setTaskList={setTaskList}
              />
            ));
          })()}

        </div>

      </div>
    </div>
  );
}
