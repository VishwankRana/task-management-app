import { useEffect, useState } from 'react';
import axios from 'axios';
import TaskTile from '../layout/TaskTile';
import NewTaskModal from './NewTaskModal';

export default function TaskList() {
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        fetchTaskList();
    }, []);

    const fetchTaskList = async () => {
        try {
            const taskRes = await axios.get("http://localhost:3000/api/taskmanager/tasks");
            setTaskList(taskRes.data);
        } catch (err) {
            console.error("❌ Failed to fetch Task:", err.message);
        }
    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/taskmanager/tasks/${id}`);
            setTaskList(prev => prev.filter(task => task._id !== id && task.id !== id)); // this
        } catch (err) {
            console.error("❌ Failed to delete Task:", err.message);
        }
    }

    return (
        <div>
            {/* <NewTaskModal setTaskList={setTaskList} /> */}

            <div className="w-full bg-[#e7ede5] p-4 rounded-2xl mt-4">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center mb-4">
                    <h3 className="font-[Tahoma] font-semibold">Task</h3>
                    <h3 className="font-[Tahoma] font-semibold text-center">Due Date</h3>
                    <h3 className="font-[Tahoma] font-semibold text-center">Priority</h3>
                    <h3 className="font-[Tahoma] font-semibold text-center">Status</h3>
                </div>

                {taskList.length === 0 ? (
                    <div className="text-center bg-red-500">No tasks added yet</div>
                ) : (
                    taskList.map((task) => (
                        <TaskTile key={task._id || task.id} task={task} onDelete={handleDelete} />
                    ))
                )}
            </div>
        </div>
    );
}