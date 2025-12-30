import useTasks from "../hooks/useTasks";

export default function MyTasksTile() {

    const { totalTasks, loading } = useTasks();

    return (
        <div className="bg-[#F2EBCA] h-30 w-60 p-5 rounded-xl border-2 border-black">
            <p>My Tasks</p>
            <h2>{loading ? "..." : totalTasks}</h2>
            <p>assigned to me</p>
        </div>
    )
}