import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import ProjectStatusMenu from "../components/ProjectStatus";
import ProjectPriorityMenu from "../components/ProjectPriority";

export default function TasksSettingsView({ projectId }) {

    const id = projectId;

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectPriority, setProjectPriority] = useState("");
    const [projectStatus, setProjectStatus] = useState("");
    const [projectStartDate, setProjectStartDate] = useState("");
    const [projectEndDate, setProjectEndDate] = useState("");

    useEffect(() => {
        
        axios
            .get(`http://localhost:3000/api/taskmanager/projects/${id}`)
            .then(res => {
                const p = res.data;
                setProjectName(p.projectName || "");
                setProjectDescription(p.projectDescription || "");
                setProjectStatus(p.projectStatus || "");
                setProjectPriority(p.projectPriority || "");
                // Handle date formatting - convert to YYYY-MM-DD format
                if (p.projectStartDate) {
                    const startDate = new Date(p.projectStartDate);
                    setProjectStartDate(startDate.toISOString().split('T')[0]);
                }
                if (p.projectEndDate) {
                    const endDate = new Date(p.projectEndDate);
                    setProjectEndDate(endDate.toISOString().split('T')[0]);
                }
            })
            .catch(err => {
                console.error("Fetch error:", err.response?.data || err.message);
            });
    }, [id]);



    const handleSubmit = async (e) =>{
        e.preventDefault();

        try{
            await axios.put(`http://localhost:3000/api/taskmanager/projects/${id}`,
                {
                    projectName,
                    projectDescription,
                    projectPriority,
                    projectStatus,
                    projectStartDate: projectStartDate ? new Date(projectStartDate) : null,
                    projectEndDate: projectEndDate ? new Date(projectEndDate) : null
                }
            );
            console.log("Project Details Updated Successfully");
        }
        catch(err){
            console.error("Update error:", err.response?.data || err.message);
        }
    };


  return (
    <div className="flex w-284 justify-center overflow-hidden">
      <div className="bg-[#eeefe7] p-6 w-180 rounded-2xl">
        <h1 className="text-2xl font-semibold mb-6">Project Details</h1>
        <form onSubmit = {handleSubmit}>
          <div>
            <label htmlFor="projectName" className="block font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              className="w-full p-2 border border-black rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter project name"
              value = {projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              className="w-full p-2 border border-black rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Describe your project"
              value = {projectDescription}
              onChange = { (e) => setProjectDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-between mb-2">
            <div>
              <label htmlFor="status" className="font-medium text-gray-700">
                Status
              </label>
              <ProjectStatusMenu projectStatus={projectStatus} setProjectStatus={setProjectStatus}/>
            </div>

            <div>
              <label htmlFor="priority" className="font-medium text-gray-700">
                Priority
              </label>
              <ProjectPriorityMenu projectPriority={projectPriority} setProjectPriority={setProjectPriority}/>
            </div>
          </div>

          <div>
            <label htmlFor="StartDate" className="block font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="StartDate"
              className="w-full p-2 border border-black rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value = {projectStartDate}
              onChange = {(e) => setProjectStartDate(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="EndDate" className="block font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="EndDate"
              className="w-full p-2 border border-black rounded-lg mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value = {projectEndDate}
              onChange = {(e) => setProjectEndDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end w-full">
                <Button
                    variant="contained"
                    type="submit"
                    sx={{
                        backgroundColor: "#db7657",
                        paddingY: "10px",
                        "&:hover": { backgroundColor: "#c65d3e" },
                    }}
                >
                        Save Changes
                </Button>
            </div>

        </form>
      </div>
    </div>
  );
}

