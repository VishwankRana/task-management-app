import { Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar.jsx"
import DashboardLayout from "./layout/Dashboard.jsx";      
import ProjectLayout from "./layout/Projects.jsx"; 
import MainLayout from "./layout/MainLayout.jsx";
import TasksLayout from "./layout/Tasks.jsx";
import Tasks from "./layout/Tasks.jsx"

export default function App() {
  return (
    <div className="flex h-screen p-5 gap-5 bg-[#f4f4ed]">
      <Sidebar />

      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardLayout />} />
        <Route path="/projects" element={<ProjectLayout />} />
        <Route path="/projects/:projectId/tasks" element={<TasksLayout />}/>
        </Route>
      </Routes>

      
    </div>
  );
}
