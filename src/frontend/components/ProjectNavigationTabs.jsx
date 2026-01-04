import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

export default function ProjectNavigationTabs({ activeTab, setActiveTab }) {

  const tabs = [
    { id: "tasks", label: "Tasks", icon: <ViewListRoundedIcon fontSize="small" /> },
    { id: "calendar", label: "Calendar", icon: <CalendarMonthRoundedIcon fontSize="small" /> },
    { id: "analytics", label: "Analytics", icon: <QueryStatsRoundedIcon fontSize="small" /> },
    { id: "settings", label: "Settings", icon: <SettingsRoundedIcon fontSize="small" /> }
  ];

  const activeIndex = tabs.findIndex(t => t.id === activeTab);

  return (
    <div className="relative flex h-11 rounded-2xl border border-[#c7661a]
                    bg-[#fff1e3] shadow-sm px-1">

      {/* Sliding active indicator */}
      <div
        className="absolute top-1 bottom-1 w-1/4 rounded-xl 
                   bg-white shadow-md transition-all duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />

      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative z-10 flex-1 flex items-center justify-center gap-2
                      text-sm font-semibold transition-all duration-200 rounded-xl
                      ${
                        activeTab === tab.id
                          ? "text-[#b4530d]"
                          : "text-[#b4530d]/60 hover:text-[#b4530d]"
                      }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
