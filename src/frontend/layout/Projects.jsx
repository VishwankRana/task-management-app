import NewProjectBtn from "../components/NewProjectBtn"
import Stack from "@mui/material/Stack";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import ProjectTiles from '../components/ProjectTiles'
import DarkModeToggle from "../components/DarkModeToggle";

export default function ProjectLayout() {
    return (
      <Stack spacing={3} alignItems="flex-start" className="w-full"> 

            <div className="w-full px-6 py-4 bg-white dark:bg-[#1e293b] sticky top-0 z-10 shadow-[0_1px_0_0_#f0f0f0,0_2px_8px_0_rgba(29,53,87,0.06)] dark:shadow-[0_1px_0_0_#1e293b,0_2px_8px_0_rgba(0,0,0,0.3)] border-b-2 border-[#d97757]/20">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="bg-[#d97757]/10 rounded-lg p-1.5">
                    <FolderRoundedIcon sx={{ color: "#d97757", fontSize: "1.5rem" }} />
                  </div>
                  <div>
                    <h1 className="text-[22px] font-[900] text-[#1D3557] dark:text-slate-100 leading-tight tracking-tight">
                      Projects
                    </h1>
                    <p className="text-xs text-gray-400 dark:text-slate-400 leading-none mt-0.5">Manage and track your projects</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DarkModeToggle />
                  <NewProjectBtn />
                </div>
              </div>
            </div>

            <div className="p-5 w-full">
            <ProjectTiles/>
            </div>
    </Stack>
    )
}