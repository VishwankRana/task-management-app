import { Stack } from "@mui/material"
import NewTaskButton from "../components/NewTaskBtn"
import TaskList from "../components/TaskList"
import NewTaskModal from "../components/NewTaskModal"
import { useEffect, useState } from "react"

export default function TasksLayout(){
    const [taskList, setTaskList] = useState([])

    return(
        <Stack spacing={3} alignItems="flex-start">

            <h1 className="text-[30px] font-[1000]   text-[#1D3557]">Tasks</h1>

            
            <div>
              <NewTaskModal setTaskList={setTaskList}/>
            </div>

            <div className="flex w-full justify-between">
                <div className="w-55 h-20 p-2 border-2 rounded bg-[#eeefe6]">
                    <p className="font-semibold">Total Tasks</p>
                    <h2 className="text-3xl font-bold">1</h2>
                </div>

                <div className="w-55 h-20 p-2 border-2 rounded bg-[#eeefe6]">
                    <p className="font-semibold">Completed</p>
                    <h2 className="text-3xl font-bold">3</h2>
                </div>

                <div className="w-55 h-20 p-2 border-2 rounded bg-[#eeefe6]">
                    <p className="font-semibold">In Progress</p>
                    <h2 className="text-3xl font-bold">2</h2>
                </div>
            </div>
            <div>
            <TaskList />
            </div>
        </Stack>
    )
     
}


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Stack } from "@mui/material";
// import NewTaskModal from "../components/NewTaskModal";
// import TaskList from "../components/TaskList";

// export default function TasksLayout() {
//     const { projectId } = useParams();   

//     const [project, setProject] = useState(null);
//     const [taskList, setTaskList] = useState([]);

//     useEffect(() => {
//         fetch(`http://localhost:3000/api/taskmanager/projects/${projectId}`)
//             .then(res => res.json())
//             .then(data => setProject(data))
//             .catch(err => console.error(err));
//     }, [projectId]);

//     return (
//         <Stack spacing={3} alignItems="flex-start">
//             <h1 className="text-[30px] font-[1000] text-[#1D3557]">
//                 {project ? project.projectName : "Loading..."}
//             </h1>

//             <NewTaskModal
//                 projectId={projectId}
//                 setTaskList={setTaskList}
//             />

//             <TaskList
//                 projectId={projectId}
//                 taskList={taskList}
//                 setTaskList={setTaskList}
//             />
//         </Stack>
//     );
// }
