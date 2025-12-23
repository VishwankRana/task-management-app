import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { useMemo } from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PriorityPieChart({ taskList = [] }) {
  const chartData = useMemo(() => {
    if (!taskList || taskList.length === 0) return null;

    const counts = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    taskList.forEach(t => {
      const p = t.priority || "Low";
      if (counts.hasOwnProperty(p)) counts[p] += 1;
      else counts[p] = (counts[p] || 0) + 1;
    });

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: "Tasks by Priority",
          data: Object.values(counts),
          backgroundColor: [
            "#60a5fa", // Low
            "#34d399", // Medium
            "#fbbf24", // High
            "#f87171", // Urgent
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [taskList]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  if (!chartData) return <div className="p-4 text-gray-500">No tasks to display</div>;

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-xl shadow">
      <Pie data={chartData} options={options} />
    </div>
  );
}
