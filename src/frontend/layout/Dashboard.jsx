import Stack from "@mui/material/Stack";
import NewProjectBtn from "../components/NewProjectBtn.jsx";
import TotalProjectTile from "../SummaryOverview/TotalProjectTile.jsx";
import CompletedProjects from "../SummaryOverview/CompletedProjects.jsx";
import MyTasksTile from "../SummaryOverview/MyTasks.jsx";
import ProjectOverview from "../ProjectOverview/ProjectOverview.jsx";
import RecentActivity from "../ProjectOverview/RecentActivity.jsx";
import MyTasksSummary from "../TasksSummary/MyTasksSummary.jsx";
import OverdueSummary from "../TasksSummary/OverdueSummary.jsx";
import InProgressSummary from "../TasksSummary/InProgressSummary.jsx";
import { useProject } from "../context/ProjectContext";

export default function Dashboard() {
  useProject();
  return (
    <>
      <Stack spacing={3} alignItems="flex-start" className="w-full">
        <div className="w-full p-5 border-b-2 border-black">
          <h1 className="flex items-center justify-between w-full text-[30px] font-[1000] text-[#1D3557]">
            Dashboard
            <NewProjectBtn />
          </h1>
          <p className="text-[#1d3559]">
            Here's what's happening with your projects today
          </p>
        </div>

        <div className="w-full p-5">
          <div className="flex justify-between w-full mb-8">
            <TotalProjectTile />
            <CompletedProjects />
            <MyTasksTile />
          </div>

          <div className="w-full flex justify-between">
            <div>
              <ProjectOverview />
              <RecentActivity />
            </div>

            <div className="flex flex-col justify-between h-[36em]">
              <MyTasksSummary />
              <InProgressSummary />
              <OverdueSummary />
            </div>
          </div>
        </div>
      </Stack>
    </>
  );
}
