import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NewTaskModal from "../components/NewTaskModal";
import ArrowBackButton from "../components/ArrowBackButton";
import TaskList from "../components/TaskList";
import ProjectNavigationTabs from "../components/ProjectNavigationTabs";
import TasksCalenderView from "./TasksCalenderView";
import TasksAnalyticsView from "./TasksAnalyticsView";
import TasksSettingsView from "./TasksSettingsView";

export default function TasksLayout() {
  const { projectId } = useParams();
  const [taskList, setTaskList] = useState([]);
  const [projectTitle, setProjectTitle] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");


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
    <Stack spacing={3} alignItems="flex-start" className="w-full">

      <div className="border-black border-b-2 w-full p-5">
      <div className="flex items-center justify-between ">
        <h1 className="text-[30px] font-bold text-[#1D3557]">
      Tasks
      </h1>
      <NewTaskModal setTaskList={setTaskList} />
      </div>  
      <p className="text-[#1d3559]">Tasks workspace - manage, analyze & track progress</p>
      </div>
      
      <div className="flex items-center px-5">
      <div className="mr-4"><ArrowBackButton /></div>
      <h1 className="text-[30px] font-bold text-[#1D3557]"> {projectTitle ? projectTitle.projectName : "Loading..."}</h1>
      </div>


       <div className="w-full grid grid-cols-4 gap-4 px-5">

        <div className="rounded-2xl border border-[#1d3557] bg-[#e8f0ff]
                        p-3 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-[#1d3557]">Total Tasks</p>
          <h2 className="text-3xl font-extrabold text-[#1d3557]">
            {totalTasks}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#2a7a35] bg-[#e9f7ec]
                        p-3 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-[#2a7a35]">Completed</p>
          <h2 className="text-3xl font-extrabold text-[#1c4d23]">
            {completedTasks}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#c7a10a] bg-[#fff7d6] p-3 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-[#8a6d09]">
            Pending
          </p>
          <h2 className="text-3xl font-extrabold text-[#6b5407]">
            {pendingTasks}
          </h2>
        </div>


        <div className="rounded-2xl border border-[#6b7280] bg-[#eef1f6] p-3 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-[#4b5563]">
            In Progress
            </p>
          
          <h2 className="text-3xl font-extrabold text-[#374151]">
            {inProgressTasks}
          </h2>

        </div>

      </div>

      <div className="px-5 w-full">
      <ProjectNavigationTabs activeTab = {activeTab} setActiveTab={setActiveTab}/>
        {activeTab === "tasks" && <TaskList taskList={taskList} setTaskList={setTaskList} /> }
        {activeTab === "calendar" && <TasksCalenderView taskList={taskList}/> }
        {activeTab === "analytics" && <TasksAnalyticsView taskList={taskList} /> }
        {activeTab === "settings" && <TasksSettingsView projectId={projectId}/> }
      </div>  
    </Stack>
  );
}