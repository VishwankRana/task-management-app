import axios from 'axios';
import { useEffect, useState } from 'react';
import NewTaskModal from './modal';
import TaskTile from '../layout/taskTile';

export default function TaskList() {
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        fetchTaskList();
    }, []);

    const fetchTaskList = async () => {
        try {
            const taskRes = await axios.get("http://localhost:3000/api/taskmanager/task");
            setTaskList(taskRes.data);
        } catch (err) {
            console.error("❌ Failed to fetch Task:", err.message);
        }
    };

    return (
        <div>
            <NewTaskModal setTaskList={setTaskList} />

            <div className="w-full bg-[#e7ede5] p-4 rounded-2xl mt-4">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center mb-4">
                    <h3 className="font-[Tahoma] font-semibold">Task</h3>
                    <h3 className="font-[Tahoma] font-semibold text-center">Due Date</h3>
                    <h3 className="font-[Tahoma] font-semibold text-center">Priority</h3>
                    <h3 className="font-[Tahoma] font-semibold text-center">Status</h3>
                </div>

                {taskList.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No tasks yet. Create your first task!</p>
                ) : (
                    taskList.map((task) => (
                        <TaskTile key={task._id || task.id} task={task} />
                    ))
                )}
            </div>
        </div>
    );
}