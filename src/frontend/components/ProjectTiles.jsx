import { useEffect,useState } from "react";

export default function ProjectTiles(){

    const [projects, setProjects] = useState([]);

    useEffect(() =>{
        fetch("http://localhost:3000/api/taskmanager/projects")
            .then(res=>res.json())
            .then(data =>{
                setProjects(data);
            })
            .catch(err => {
                console.error(err);
            })
    }, []);


    return (
    <div className="flex flex-wrap justify-between gap-4">
        {projects.map(project => (
            <div
                key={project._id}
                className="h-40 w-80 border border-black p-4 rounded-lg bg-[#f0efe7] flex flex-col justify-between"
            >
                {/* Top section */}
                <div>
                    <h1 className="text-xl font-bold">
                        {project.projectName}
                    </h1>

                    <p className="line-clamp-2 text-sm">{project.projectDescription}</p>
                </div>

                {/* Bottom section */}
                <div className="flex justify-between">
                    <h3 className="font-semibold">
                        {project.projectStatus}
                    </h3>

                    <h3 className="font-semibold">
                        {project.projectPriority} Priority
                    </h3>
                </div>
            </div>
        ))}
    </div>
)};
