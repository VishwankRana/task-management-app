
export default function ProjectNavigationTabs({activeTab, setActiveTab}) {

  return (
    <div className="flex h-9 w-120 border-2 rounded-lg bg-[#fdf8f4]">

      <button
        onClick={() => setActiveTab("tasks")}
        className={`flex justify-center items-center w-30 border-r-2 rounded-l-lg font-semibold
          transition-colors duration-200 cursor-pointer
          ${activeTab === "tasks" ? "bg-[#cfcfc2]" : "bg-[#fdf8f4] hover:bg-[#cfcfc2]"}`}
      >
        Tasks
      </button>

      <button
        onClick={() => setActiveTab("calendar")}
        className={`flex justify-center items-center w-30 border-r-2 font-semibold
          transition-colors duration-200 cursor-pointer
          ${activeTab === "calendar" ? "bg-[#cfcfc2]" : "bg-[#fdf8f4] hover:bg-[#cfcfc2]"}`}
      >
        Calendar
      </button>

      <button
        onClick={() => setActiveTab("analytics")}
        className={`flex justify-center items-center w-30 border-r-2 font-semibold
          transition-colors duration-200 cursor-pointer
          ${activeTab === "analytics" ? "bg-[#cfcfc2]" : "bg-[#fdf8f4] hover:bg-[#cfcfc2]"}`}
      >
        Analytics
      </button>

      <button
        onClick={() => setActiveTab("settings")}
        className={`flex justify-center items-center w-30 rounded-r-lg font-semibold
          transition-colors duration-200 cursor-pointer
          ${activeTab === "settings" ? "bg-[#cfcfc2]" : "bg-[#fdf8f4] hover:bg-[#cfcfc2]"}`}
      >
        Settings
      </button>

    </div>
  );
}
