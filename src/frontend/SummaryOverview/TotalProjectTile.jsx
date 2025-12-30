import useProjects from "../hooks/useProjects";

export default function TotalProjectTile() {
    
    const {projects, loading} = useProjects();
      
    return (
        <div className="bg-[#F2EBCA] h-30 w-60 p-5 rounded-xl border-2 border-black">
            <p>Total Projects</p>
            <h2>{loading ? "..." : projects.length}</h2>
            <p>projects in workspace</p>
        </div>
    )
}