import Sidebar from "./Sidebar";
import TaskList from "../components/TaskList";
import Stack from '@mui/material/Stack';
import NewProjectBtn from "../components/NewProjectBtn";
import TotalProjectTile from "../SummaryOverview/TotalProjectTile"
import CompletedProjects from "../SummaryOverview/CompletedProjects";
import MyTasksTile from "../SummaryOverview/MyTasks";
import OverDueTile from "../SummaryOverview/OverDue";
import ProjectOverview from "../ProjectOverview/ProjectOverview";
import RecentActivity from "../ProjectOverview/RecentActivity";
import MyTasksSummary from "../TasksSummary/MyTasksSummary";
import OverdueSummary from "../TasksSummary/OverdueSummary";
import InProgressSummary from "../TasksSummary/InProgressSummary";


export default function MainLayout() {
    return (
        <div className="flex h-screen p-5 gap-5 bg-gray-50">
            <Sidebar />

            <main className="flex-1 bg-[#F1FAEE] rounded-xl shadow-lg overflow-y-auto p-10">
                <Stack spacing={3} alignItems="flex-start">
                    {/* <TaskList /> */}
                    <NewProjectBtn />

                    <div className="flex justify-between w-full">
                        <TotalProjectTile />
                        <CompletedProjects />
                        <MyTasksTile />
                        <OverDueTile />
                    </div>

                    <div className="w-full flex justify-between">
                        <div>
                            <ProjectOverview />
                            <RecentActivity />
                        </div>

                        <div className="flex flex-col justify-between mb-21">
                            <MyTasksSummary />
                            <OverdueSummary />
                            <InProgressSummary />
                        </div>
                    </div>


                </Stack>
            </main>
        </div>
    );
}
