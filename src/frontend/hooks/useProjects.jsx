import { useProject } from '../context/ProjectContext';

export default function useProjects() {
  const { projects, loading } = useProject();

  const completedProjects = projects.filter(
    (p) => p.projectStatus?.toLowerCase() === "completed"
  );

  const inProgressProjects = projects.filter(
    (p) => p.projectStatus?.toLowerCase() === "in progress"
  );

  return { projects, loading, completedProjects, inProgressProjects };
}
