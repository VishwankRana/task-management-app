import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const { isAuthenticated, loading: authLoading, user, sessionVersion } = useAuth();
    const [openNewPrjModal, setOpenNewPrjModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProjects = useCallback(async () => {
        if (!isAuthenticated) {
            setProjects([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/api/taskmanager/projects", {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch projects (${res.status})`);
            }

            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching projects:", err);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user?.id]);

    useEffect(() => {
        if (authLoading) return;
        fetchProjects();
    }, [authLoading, isAuthenticated, user?.id, sessionVersion, fetchProjects]);

    const addProject = (newProject) => {
        setProjects((prev) => [...prev, newProject]);
    };

    const deleteProject = (projectId) => {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
    };

    return (
        <ProjectContext.Provider value={{
            openNewPrjModal,
            setOpenNewPrjModal,
            projects,
            setProjects,
            loading,
            fetchProjects,
            addProject,
            deleteProject,
        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);

    if (!context) {
        throw new Error('useProject must be used within ProjectProvider');
    }

    return context;
}
