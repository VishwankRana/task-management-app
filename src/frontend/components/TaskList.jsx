import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import TaskTile from '../layout/TaskTile';

export default function TaskList() {

  const { projectId } = useParams();
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    if (!projectId) return;
    fetchTaskList();
  }, [projectId]);

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/taskmanager/tasks/${id}`
      );
      setTaskList(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete Task:", err.message);
    }
  };

  return (
    <div className="flex justify-center w-full my-6">

      <div className="w-full rounded-2xl border border-[#d6d3cd]
                      bg-white shadow-sm">

        {/* Header Bar */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr]
                        gap-4 px-4 py-2 rounded-t-2xl
                        bg-[#fff1e3] border-b border-[#c9b5a3]">

          <h3 className="font-semibold text-[#3a2b20]">Task</h3>
          <h3 className="font-semibold text-center text-[#3a2b20]">Priority</h3>
          <h3 className="font-semibold text-center text-[#3a2b20]">Status</h3>
          <h3 className="font-semibold text-center text-[#3a2b20]">Due Date</h3>
          <h3 className="font-semibold text-center text-[#3a2b20]">Type</h3>

        </div>

        {/* Task Rows */}
        <div className="p-3 space-y-3">

          {taskList.length === 0 ? (
            <div className="text-sm text-gray-600 text-center py-4">
              No tasks added yet
            </div>
          ) : (
            taskList.map(task => (
              <TaskTile
                key={task._id || task.id}
                task={task}
                onDelete={handleDelete}
                setTaskList={setTaskList}
              />
            ))
          )}

        </div>

      </div>
    </div>
  );
}
