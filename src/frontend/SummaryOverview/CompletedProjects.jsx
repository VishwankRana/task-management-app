import useProjects from "../hooks/useProjects"

export default function CompletedProjects() {

    const {projects, loading, completedProjects} = useProjects();
    
    return (
        <div className="bg-[#F2EBCA] h-30 w-60 p-5 rounded-xl border-2 border-black">
            <p>Completed Projects</p>
            <h2>{loading ? "..." : completedProjects.length}</h2>
            <p>of {loading ? "..." : projects.length} total</p>
        </div>
    )
}