import StatusTaskChart from "../components/StatusTaskChart"
import PriorityPieChart from "../components/PriorityPieChart"

export default function TasksAnalyticsView({ taskList = [] }){
    return(
    <>
    <h1 className="text-3xl font-bold">Analytics</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div>
            <h2 className="text-xl font-semibold flex mb-2">Tasks By Status</h2>
            <StatusTaskChart taskList={taskList} />
        </div>
        <div>
            <h2 className="flex mb-2 text-xl font-semibold">Tasks By Priority</h2>
            <PriorityPieChart taskList={taskList} />
        </div>
    </div>
    </>
    )
}