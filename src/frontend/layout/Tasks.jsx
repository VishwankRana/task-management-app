import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArrowBackButton from "../components/ArrowBackButton";
import axios from "axios";

import NewTaskModal from "../components/NewTaskModal";
import TaskList from "../components/TaskList";

export default function TasksLayout() {
  const { projectId } = useParams();
  const [taskList, setTaskList] = useState([]);
  const [projectTitle, setProjectTitle] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    axios
      .get(`http://localhost:3000/api/taskmanager/projects/${projectId}`)
      .then(res => setProjectTitle(res.data))
      .catch(err => console.error(err));

    axios
      .get(`http://localhost:3000/api/taskmanager/projects/${projectId}/tasks`)
      .then(res => setTaskList(res.data))
      .catch(err => console.error(err));
  }, [projectId]);

  const totalTasks = taskList.length;
  const completedTasks = taskList.filter(t => t.status === "Completed").length;
  const inProgressTasks = taskList.filter(t => t.status === "In-progress").length;
  const pendingTasks = taskList.filter(t => t.status === "Pending").length;

  return (
    <Stack spacing={3} alignItems="flex-start">
      <h1 className="text-[30px] font-bold text-[#1D3557]">TASKS</h1>
      <div className="flex w-full justify-between">
      <div className="flex items-center">
      <div className="mr-4"><ArrowBackButton /></div>
      <h1 className="text-[30px] font-bold text-[#1D3557]"> {projectTitle ? projectTitle.projectName : "Loading..."}</h1>
      </div>
      <NewTaskModal setTaskList={setTaskList} />
      </div>  


      <div className="flex w-full justify-between">
        <div className="w-55 h-20 p-2 border-2 rounded bg-[#eeefe6]">
          <p className="font-semibold">Total Tasks</p>
          <h2 className="text-3xl font-bold">{totalTasks}</h2>
        </div>

        <div className="w-55 h-20 p-2 border-2 rounded bg-[#eeefe6]">
          <p className="font-semibold">Completed</p>
          <h2 className="text-3xl font-bold">{completedTasks}</h2>
        </div>

        <div className="w-55 h-20 p-2 border-2 rounded bg-[#eeefe6]">
          <p className="font-semibold">Pending</p>
          <h2 className="text-3xl font-bold">{pendingTasks}</h2>
        </div>

        <div className="w-55 h-20 p-2 border-2 rounded bg-[#eeefe6]">
          <p className="font-semibold">In Progress</p>
          <h2 className="text-3xl font-bold">{inProgressTasks}</h2>
        </div>
      </div>

      <TaskList taskList={taskList} setTaskList={setTaskList} />
    </Stack>
  );
}