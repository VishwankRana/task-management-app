import { Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar.jsx"
import DashboardLayout from "./layout/Dashboard.jsx";      
import ProjectLayout from "./layout/Projects.jsx"; 
import MainLayout from "./layout/MainLayout.jsx";

export default function App() {
  return (
    <div className="flex h-screen p-5 gap-5 bg-gray-50">
      <Sidebar />

      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardLayout />} />
        <Route path="/projects" element={<ProjectLayout />} />
        </Route>
      </Routes>
    </div>
  );
}
