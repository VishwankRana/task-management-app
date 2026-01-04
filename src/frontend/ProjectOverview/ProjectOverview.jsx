import ProjectOverviewTile from "./projectOverviewTile";
import ArrowForwardButton from "../components/ArrowForwardButton";

export default function ProjectOverview() {
  return (
    <div className="h-[23em] w-[55em] flex flex-col rounded-2xl 
                    border border-[#1f4d63] bg-[#e8f4ff]
                    shadow-md hover:shadow-lg transition-all duration-200">

      {/* Header */}
      <div className="p-3 border-b border-[#1f4d63] 
                      flex justify-between items-center">

        <h1 className="text-[18px] font-semibold text-[#1f4d63]">
          Project Overview
        </h1>

        <div className="flex items-center gap-1 
                        text-sm font-medium text-[#1f4d63]
                        cursor-pointer hover:opacity-80">
          View all projects
          <ArrowForwardButton />
        </div>
      </div>

      {/* Content */}
      <div className="w-full h-full p-4">
        <ProjectOverviewTile />
      </div>

    </div>
  );
}
