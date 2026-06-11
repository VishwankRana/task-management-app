import useProjects from "../hooks/useProjects";
import useTasks from "../hooks/useTasks";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";

function computeHealthScore(projectTasks, projectEndDate) {
  const now = new Date();

  const total = projectTasks.length;
  const completed = projectTasks.filter((t) => t.status === "Completed").length;
  const overdue = projectTasks.filter((t) => {
    if (!t.dueDate) return false;
    return (
      new Date(t.dueDate) < now &&
      t.status !== "Completed" &&
      t.status !== "Cancelled"
    );
  }).length;

  // Completion score (0–40)
  const completionScore =
    total === 0 ? 20 : Math.round((completed / total) * 40);

  // Overdue score (0–30): penalise overdue tasks
  const overdueRatio = total === 0 ? 0 : overdue / total;
  const overdueScore = Math.round((1 - overdueRatio) * 30);

  // Deadline score (0–30)
  let deadlineScore = 30;
  if (projectEndDate) {
    const daysLeft = Math.floor(
      (new Date(projectEndDate) - now) / (1000 * 60 * 60 * 24)
    );
    if (daysLeft < 0) deadlineScore = 0;
    else if (daysLeft <= 3) deadlineScore = 5;
    else if (daysLeft <= 7) deadlineScore = 12;
    else if (daysLeft <= 14) deadlineScore = 20;
    else if (daysLeft <= 30) deadlineScore = 26;
    else deadlineScore = 30;
  }

  return Math.min(100, completionScore + overdueScore + deadlineScore);
}

function scoreColor(score) {
  if (score >= 70) return { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", bar: "bg-green-500" };
  if (score >= 40) return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300", bar: "bg-yellow-400" };
  return { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", bar: "bg-red-500" };
}

function scoreLabel(score) {
  if (score >= 70) return "Healthy";
  if (score >= 40) return "At Risk";
  return "Critical";
}

export default function ProjectHealthScore() {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks();

  const loading = projectsLoading || tasksLoading;

  const projectsWithScores = projects.map((p) => {
    const projectTasks = tasks.filter((t) => t.projectId === p.id);
    const score = computeHealthScore(projectTasks, p.projectEndDate);
    return { ...p, score, taskCount: projectTasks.length };
  });

  return (
    <div className="w-full flex-1 flex flex-col rounded-2xl border border-[#1f4d63] bg-[#e8f4ff] shadow-md hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="border-b border-[#1f4d63] px-4 py-3 flex items-center gap-2">
        <MonitorHeartRoundedIcon sx={{ color: "#1f4d63", fontSize: "1.2rem" }} />
        <h1 className="text-sm font-semibold text-[#1f4d63]">
          Project Health
        </h1>
        <span className="ml-auto bg-[#1f4d63] text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {loading ? "…" : projects.length}
        </span>
      </div>

      {/* Score legend */}
      <div className="px-4 pt-2 pb-1 flex gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Healthy ≥70
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> At Risk ≥40
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Critical
        </span>
      </div>

      {/* Project list */}
      <div className="p-3 space-y-2 flex-1 overflow-y-auto">
        {loading && (
          <p className="text-sm text-gray-500 px-1">Loading…</p>
        )}

        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center py-5 text-center">
            <FavoriteRoundedIcon sx={{ color: "#9ca3af", fontSize: "2.2rem" }} />
            <p className="text-sm text-gray-500 mt-2">No projects yet</p>
          </div>
        )}

        {!loading &&
          projectsWithScores.map((p) => {
            const colors = scoreColor(p.score);
            return (
              <div
                key={p.id}
                className="rounded-xl border border-[#d4d9e6] bg-white p-3 shadow-sm
                           hover:shadow-md transition-shadow duration-200"
              >
                {/* Project name + score badge */}
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-800 truncate flex-1">
                    {p.projectName}
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border} shrink-0`}
                  >
                    {p.score}
                  </span>
                </div>

                {/* Label */}
                <p className={`text-xs font-medium mt-0.5 ${colors.text}`}>
                  {scoreLabel(p.score)} · {p.taskCount} task{p.taskCount !== 1 ? "s" : ""}
                </p>

                {/* Score bar */}
                <div className="mt-2 w-full h-1.5 rounded-full bg-gray-100">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${colors.bar}`}
                    style={{ width: `${p.score}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
