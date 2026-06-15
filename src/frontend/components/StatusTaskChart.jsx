import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StatusTaskChart({ taskList = [] }) {
    const { isDark } = useTheme();

    const chartData = useMemo(() => {
        if (!taskList || taskList.length === 0) {
            return null;
        }

        const statusCounts = {};
        taskList.forEach(task => {
            const status = task.status || "Pending";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        return {
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    label: "Tasks",
                    data: Object.values(statusCounts),
                    backgroundColor: ["#fbbf24", "#34d399", "#ef4444", "#60a5fa", "#a78bfa"],
                    borderRadius: 6,
                },
            ],
        };
    }, [taskList]);

    const textColor = isDark ? "#94a3b8" : "#6b7280";
    const gridColor = isDark ? "#334155" : "#f0f0f0";

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: textColor },
                grid: { color: gridColor },
            },
            x: {
                ticks: { color: textColor },
                grid: { color: gridColor },
            },
        },
        plugins: {
            legend: {
                labels: { color: isDark ? "#e2e8f0" : "#374151" },
            },
        },
    };

    if (!chartData) return <div className="p-4 text-gray-500 dark:text-slate-400">No tasks to display</div>;
    return (
        <div className="w-120 h-80">
            <Bar data={chartData} options={options} />
        </div>
    );
}