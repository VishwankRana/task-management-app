import { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

// Create the Provider component
export function ProjectProvider({ children }) {
    // All shared state goes here
    const [openNewPrjModal, setOpenNewPrjModal] = useState(false);
    const [projects, setProjects] = useState([]);

    // Any functions you want to share
    const addProject = (newProject) => {
        setProjects(prev => [...prev, newProject]);
    };

    const deleteProject = (projectId) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
    };

    // Provide the values
    return (
        <ProjectContext.Provider value={{
            openNewPrjModal,
            setOpenNewPrjModal,
            projects,
            setProjects,
            addProject,
            deleteProject
        }}>
            {children}
        </ProjectContext.Provider>
    );
}

// Create custom hook for easy access
export function useProject() {
    const context = useContext(ProjectContext);
    
    if (!context) {
        throw new Error('useProject must be used within ProjectProvider');
    }
    
    return context;
}