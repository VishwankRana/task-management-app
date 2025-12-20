import NewProjectBtn from "../components/NewProjectBtn"
import Stack from "@mui/material/Stack";
import ProjectTiles from '../components/ProjectTiles'

export default function ProjectLayout() {
    return (
      <Stack spacing={3} alignItems="flex-start"> 

            <div className="flex justify-between w-full items-center">

            <div>  
            <h1 className="text-[30px] font-[1000] text-[#1D3557]">Projects</h1>
            <p className="text-[#1d3559]">Manage and track your projects</p>
            </div>

            <div>
              <NewProjectBtn />
            </div>
            </div>
            <div>
            <ProjectTiles/>
            </div>
    </Stack>
    )
}