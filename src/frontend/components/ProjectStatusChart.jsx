import { useMemo } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import { useProject } from "../context/ProjectContext";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const STATUS_ORDER = ["Planning", "Active", "In Progress", "Completed", "On Hold", "Cancelled"];
const STATUS_COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#94a3b8", "#fb923c", "#f87171"];

export default function ProjectStatusChart() {
  const { projects } = useProject();
  const { isDark } = useTheme();

  const chartData = useMemo(() => {
    const counts = {};
    STATUS_ORDER.forEach((s) => { counts[s] = 0; });

    projects.forEach((p) => {
      const status = p.projectStatus || "Planning";
      counts[status] = (counts[status] || 0) + 1;
    });

    const labels = STATUS_ORDER.filter((s) => counts[s] > 0);
    if (labels.length === 0) return null;

    return {
      labels,
      datasets: [
        {
          label: "Projects",
          data: labels.map((l) => counts[l]),
          backgroundColor: labels.map((l) => STATUS_COLORS[STATUS_ORDER.indexOf(l)]),
          borderRadius: 6,
        },
      ],
    };
  }, [projects]);

  const textColor = isDark ? "#94a3b8" : "#6b7280";
  const gridColor = isDark ? "#334155" : "#f0f0f0";
  const tealColor = isDark ? "#5eead4" : "#1f4d63";

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: textColor, stepSize: 1 },
        grid: { color: gridColor },
      },
      x: {
        ticks: { color: textColor },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="h-[23em] w-full min-w-0 flex flex-col rounded-2xl border border-[#1f4d63] dark:border-teal-700/50 bg-[#e8f4ff] dark:bg-[#1e293b] shadow-md hover:shadow-lg transition-all duration-200">
      <div className="shrink-0 h-14 px-4 border-b border-[#1f4d63] dark:border-teal-700/50 flex items-center gap-2">
        <QueryStatsRoundedIcon sx={{ color: tealColor, fontSize: "1.2rem" }} />
        <h1 className="text-base font-semibold text-[#1f4d63] dark:text-teal-300">
          Projects by Status
        </h1>
      </div>
      <div className="flex-1 p-4 min-h-0">
        {!chartData ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-slate-400">
            No projects to display
          </div>
        ) : (
          <div className="h-full w-full">
            <Bar data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
}
