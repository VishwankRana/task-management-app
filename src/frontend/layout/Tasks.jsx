import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import BallotRoundedIcon from "@mui/icons-material/BallotRounded";
import ChecklistRtlRoundedIcon from "@mui/icons-material/ChecklistRtlRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
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
  const [statusFilter, setStatusFilter] = useState("all");

  const handleFilterClick = (filter) => {
    setStatusFilter(prev => prev === filter ? "all" : filter);
  };


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

      <div className="w-full px-6 py-4 bg-white sticky top-0 z-10 shadow-[0_1px_0_0_#f0f0f0,0_2px_8px_0_rgba(29,53,87,0.06)] border-b-2 border-[#d97757]/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="bg-[#d97757]/10 rounded-lg p-1.5">
              <AssignmentRoundedIcon sx={{ color: "#d97757", fontSize: "1.5rem" }} />
            </div>
            <div>
              <h1 className="text-[22px] font-[900] text-[#1D3557] leading-tight tracking-tight">
                Tasks
              </h1>
              <p className="text-xs text-gray-400 leading-none mt-0.5">
                Tasks workspace — manage, analyze & track progress
              </p>
            </div>
          </div>
          <NewTaskModal setTaskList={setTaskList} />
        </div>
      </div>
      
      <div className="flex items-center px-5">
      <div className="mr-4"><ArrowBackButton /></div>
      <h1 className="text-[30px] font-bold text-[#1D3557]"> {projectTitle ? projectTitle.projectName : "Loading..."}</h1>
      </div>


       <div className="w-full grid grid-cols-4 gap-4 px-5">

        <button
          onClick={() => handleFilterClick("all")}
          className={`w-full p-5 rounded-2xl border border-[#1d3557] bg-[#e8f0ff] shadow-md text-left transition-all duration-200
            hover:shadow-lg active:scale-[0.97]
            ${statusFilter === "all" ? "ring-2 ring-[#1d3557] ring-offset-1" : ""}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-l font-semibold text-[#1d3557]">Total Tasks</p>
            <span className="p-2 rounded-xl bg-[#1d3557] text-white shadow-sm">
              <BallotRoundedIcon fontSize="small" />
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-[#1d3557] mt-1">{totalTasks}</h2>
          <p className="text-xs font-medium text-[#274c77] mt-1">tasks in this project</p>
        </button>

        <button
          onClick={() => handleFilterClick("Completed")}
          className={`w-full p-5 rounded-2xl border border-[#2a7a35] bg-[#e9f7ec] shadow-md text-left transition-all duration-200
            hover:shadow-lg active:scale-[0.97]
            ${statusFilter === "Completed" ? "ring-2 ring-[#2a7a35] ring-offset-1" : ""}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-l font-semibold text-[#245d2c]">Completed</p>
            <span className="p-2 rounded-xl bg-[#2a7a35] text-white shadow-sm">
              <ChecklistRtlRoundedIcon fontSize="small" />
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-[#1c4d23] mt-1">{completedTasks}</h2>
          <p className="text-xs font-medium text-[#245d2c] mt-1">of {totalTasks} total</p>
        </button>

        <button
          onClick={() => handleFilterClick("Pending")}
          className={`w-full p-5 rounded-2xl border border-[#c7a10a] bg-[#fff7d6] shadow-md text-left transition-all duration-200
            hover:shadow-lg active:scale-[0.97]
            ${statusFilter === "Pending" ? "ring-2 ring-[#c7a10a] ring-offset-1" : ""}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-l font-semibold text-[#8a6d09]">Pending</p>
            <span className="p-2 rounded-xl bg-[#c7a10a] text-white shadow-sm">
              <PendingActionsRoundedIcon fontSize="small" />
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-[#6b5407] mt-1">{pendingTasks}</h2>
          <p className="text-xs font-medium text-[#8a6d09] mt-1">awaiting action</p>
        </button>

        <button
          onClick={() => handleFilterClick("In-progress")}
          className={`w-full p-5 rounded-2xl border border-[#6b7280] bg-[#eef1f6] shadow-md text-left transition-all duration-200
            hover:shadow-lg active:scale-[0.97]
            ${statusFilter === "In-progress" ? "ring-2 ring-[#6b7280] ring-offset-1" : ""}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-l font-semibold text-[#4b5563]">In Progress</p>
            <span className="p-2 rounded-xl bg-[#6b7280] text-white shadow-sm">
              <AssignmentRoundedIcon fontSize="small" />
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-[#374151] mt-1">{inProgressTasks}</h2>
          <p className="text-xs font-medium text-[#4b5563] mt-1">currently active</p>
        </button>

      </div>

      <div className="px-5 w-full">
      <ProjectNavigationTabs activeTab = {activeTab} setActiveTab={setActiveTab}/>
        {activeTab === "tasks" && <TaskList taskList={taskList} setTaskList={setTaskList} statusFilter={statusFilter} /> }
        {activeTab === "calendar" && <TasksCalenderView taskList={taskList}/> }
        {activeTab === "analytics" && <TasksAnalyticsView taskList={taskList} /> }
        {activeTab === "settings" && <TasksSettingsView projectId={projectId}/> }
      </div>  
    </Stack>
  );
}