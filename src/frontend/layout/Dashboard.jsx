import Stack from "@mui/material/Stack";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import NewProjectBtn from "../components/NewProjectBtn.jsx";
import TotalProjectTile from "../SummaryOverview/TotalProjectTile.jsx";
import CompletedProjects from "../SummaryOverview/CompletedProjects.jsx";
import InProgressProjectsTile from "../SummaryOverview/InProgressProjectsTile.jsx";
import MyTasksTile from "../SummaryOverview/MyTasks.jsx";
import ProjectOverview from "../ProjectOverview/ProjectOverview.jsx";
import RecentActivity from "../ProjectOverview/RecentActivity.jsx";
import TodaysFocus from "../DashboardWidgets/TodaysFocus.jsx";
import WeekAtAGlance from "../DashboardWidgets/WeekAtAGlance.jsx";
import { useProject } from "../context/ProjectContext";
import DarkModeToggle from "../components/DarkModeToggle.jsx";

export default function Dashboard() {
  useProject();
  return (
    <>
      <Stack spacing={3} alignItems="flex-start" className="w-full">
        <div className="w-full px-6 py-4 bg-white dark:bg-[#1e293b] sticky top-0 z-10 shadow-[0_1px_0_0_#f0f0f0,0_2px_8px_0_rgba(29,53,87,0.06)] dark:shadow-[0_1px_0_0_#1e293b,0_2px_8px_0_rgba(0,0,0,0.3)] border-b-2 border-[#d97757]/20">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="bg-[#d97757]/10 rounded-lg p-1.5">
                <DashboardRoundedIcon sx={{ color: "#d97757", fontSize: "1.5rem" }} />
              </div>
              <div>
                <h1 className="text-[22px] font-[900] text-[#1D3557] dark:text-slate-100 leading-tight tracking-tight">
                  Dashboard
                </h1>
                <p className="text-xs text-gray-400 dark:text-slate-400 leading-none mt-0.5">
                  Here's what's happening with your projects today
                </p>
              </div>
            </div>
            <DarkModeToggle />
          </div>
        </div>

        <div className="w-full p-5">
          <div className="flex justify-between w-full mb-8">
            <TotalProjectTile />
            <CompletedProjects />
            <InProgressProjectsTile />
            <MyTasksTile />
          </div>

          <div className="w-full flex justify-between gap-6">
            <div>
              <ProjectOverview />
              <RecentActivity />
            </div>

            <div className="flex flex-col flex-1 gap-8 min-w-0">
              <TodaysFocus />
              <WeekAtAGlance />
            </div>
          </div>
        </div>
      </Stack>
    </>
  );
}
