import { useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded";
import { useProject } from "../context/ProjectContext";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const PRIORITY_ORDER = ["High", "Medium", "Low", "Urgent"];
const PRIORITY_COLORS = ["#f87171", "#fbbf24", "#34d399", "#ef4444"];

export default function ProjectPriorityChart() {
  const { projects } = useProject();
  const { isDark } = useTheme();

  const chartData = useMemo(() => {
    const counts = {};
    PRIORITY_ORDER.forEach((p) => { counts[p] = 0; });

    projects.forEach((p) => {
      const priority = p.projectPriority || "Medium";
      counts[priority] = (counts[priority] || 0) + 1;
    });

    const labels = PRIORITY_ORDER.filter((p) => counts[p] > 0);
    if (labels.length === 0) return null;

    return {
      labels,
      datasets: [
        {
          label: "Projects",
          data: labels.map((l) => counts[l]),
          backgroundColor: labels.map((l) => PRIORITY_COLORS[PRIORITY_ORDER.indexOf(l)]),
          borderColor: isDark ? "#1e293b" : "#ffffff",
          borderWidth: 2,
        },
      ],
    };
  }, [projects, isDark]);

  const tealColor = isDark ? "#5eead4" : "#1f4d63";

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: isDark ? "#e2e8f0" : "#374151", padding: 16 },
      },
    },
  };

  return (
    <div className="w-full h-[23em] flex flex-col rounded-2xl border border-[#1f4d63] dark:border-teal-700/50 bg-[#e8f4ff] dark:bg-[#1e293b] shadow-md hover:shadow-lg transition-all duration-200">
      <div className="shrink-0 h-14 px-4 border-b border-[#1f4d63] dark:border-teal-700/50 flex items-center gap-2">
        <PieChartRoundedIcon sx={{ color: tealColor, fontSize: "1.2rem" }} />
        <h1 className="text-base font-semibold text-[#1f4d63] dark:text-teal-300">
          Projects by Priority
        </h1>
      </div>
      <div className="flex-1 p-4 min-h-0">
        {!chartData ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500 dark:text-slate-400">
            No projects to display
          </div>
        ) : (
          <div className="h-full w-full">
            <Pie data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
}
