import TaskList from "../components/TaskList.jsx";
import Stack from "@mui/material/Stack";
import NewProjectBtn from "../components/NewProjectBtn.jsx";
import TotalProjectTile from "../SummaryOverview/TotalProjectTile.jsx";
import CompletedProjects from "../SummaryOverview/CompletedProjects.jsx";
import MyTasksTile from "../SummaryOverview/MyTasks.jsx";
import OverDueTile from "../SummaryOverview/OverDue.jsx";
import ProjectOverview from "../ProjectOverview/ProjectOverview.jsx";
import RecentActivity from "../ProjectOverview/RecentActivity.jsx";
import MyTasksSummary from "../TasksSummary/MyTasksSummary.jsx";
import OverdueSummary from "../TasksSummary/OverdueSummary.jsx";
import InProgressSummary from "../TasksSummary/InProgressSummary.jsx";
import { useProject } from "../context/ProjectContext";

export default function Dashboard() {

const { projects } = useProject();
  return (
      <>
      <Stack spacing={3} alignItems="flex-start">
        <h1 className="text-[30px] font-[1000]   text-[#1D3557]">Dashboard</h1>
        <NewProjectBtn/>

        <div className="flex justify-between w-full">
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
      </Stack>
      </>
  );
}
