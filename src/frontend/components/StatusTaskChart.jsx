import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StatusTaskChart({ taskList = [] }) {
    const chartData = useMemo(() => {
        if (!taskList || taskList.length === 0) {
            return null;
        }

        // Count tasks by status
        const statusCounts = {};
        taskList.forEach(task => {
            const status = task.status || "Pending";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        return {
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    label: "Pending Tasks",
                    data: Object.values(statusCounts),
                    backgroundColor: ["#fbbf24", "#34d399", "#ef4444"],
                    borderRadius: 6,
                },
            ],
        };
    }, [taskList]);
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
        
    if (!chartData) return <div className="p-4 text-gray-500">No tasks to display</div>;
    return (
        <div className="w-120 h-80">
            <Bar data={chartData} options={options} />
        </div>
    );
}