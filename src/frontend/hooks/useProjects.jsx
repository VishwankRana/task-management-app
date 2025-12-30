import { useState, useEffect } from "react";

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/taskmanager/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, []);

  const completedProjects = projects.filter(
    p => p.projectStatus?.toLowerCase() === "completed"
  );

  return { projects, loading, completedProjects };
}
