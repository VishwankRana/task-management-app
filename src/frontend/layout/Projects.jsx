import NewProjectBtn from "../components/NewProjectBtn"
import Stack from "@mui/material/Stack";
import ProjectTiles from '../components/ProjectTiles'

export default function ProjectLayout() {
    return (
      <Stack spacing={3} alignItems="flex-start" className="w-full"> 

            <div className="flex justify-between w-full items-center border-black border-b-2 p-5">

            <div className="w-full">  
            <h1 className="flex items-center justify-between w-full text-[30px] font-[1000] text-[#1D3557]">
              Projects
              <NewProjectBtn />
              </h1>
            <p className="text-[#1d3559]">Manage and track your projects</p>

            </div>
            </div>
            <div className="p-5">
            <ProjectTiles/>
            </div>
    </Stack>
    )
}