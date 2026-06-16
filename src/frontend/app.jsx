import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./layout/Sidebar.jsx";
import DashboardLayout from "./layout/Dashboard.jsx";
import ProjectLayout from "./layout/Projects.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import TasksLayout from "./layout/Tasks.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "0.875rem",
            boxShadow: "0 4px 16px rgba(29,53,87,0.12)",
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<div className="flex-1"><Login /></div>} />
        <Route path="/register" element={<div className="flex-1"><Register /></div>} />
        <Route
          element={
            <ProtectedRoute>
              <>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <MainLayout collapsed={collapsed} />
              </>
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardLayout />} />
          <Route path="/projects" element={<ProjectLayout />} />
          <Route path="/projects/:projectId/tasks" element={<TasksLayout />} />
        </Route>
      </Routes>
    </div>
  );
}
