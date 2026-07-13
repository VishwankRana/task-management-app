import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stack, Button } from "@mui/material";
import ViewKanbanRoundedIcon from "@mui/icons-material/ViewKanbanRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DarkModeToggle from "../components/DarkModeToggle";
import KanbanBoard from "../components/KanbanBoard";
import { useTheme } from "../context/ThemeContext";
import api from "../utils/api.js";

export default function ProjectBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [projectTitle, setProjectTitle] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    api
      .get(`/api/taskmanager/projects/${projectId}`)
      .then((res) => setProjectTitle(res.data))
      .catch((err) => console.error(err));
  }, [projectId]);

  return (
    <Stack spacing={3} alignItems="flex-start" className="w-full">
      <div className="w-full px-6 py-4 bg-white dark:bg-[#1e293b] sticky top-0 z-10 shadow-[0_1px_0_0_#f0f0f0,0_2px_8px_0_rgba(29,53,87,0.06)] dark:shadow-[0_1px_0_0_#1e293b,0_2px_8px_0_rgba(0,0,0,0.3)] border-b-2 border-[#d97757]/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="bg-[#d97757]/10 rounded-lg p-1.5">
              <ViewKanbanRoundedIcon sx={{ color: "#d97757", fontSize: "1.5rem" }} />
            </div>
            <div>
              <h1 className="text-[22px] font-[900] text-[#1D3557] dark:text-slate-100 leading-tight tracking-tight">
                Board
              </h1>
              <p className="text-xs text-gray-400 dark:text-slate-400 leading-none mt-0.5">
                Kanban workspace — drag tasks across columns
              </p>
            </div>
          </div>
          <DarkModeToggle />
        </div>
      </div>

      <div className="flex items-center w-full px-5">
        <div className="mr-4">
          <Button
            variant="text"
            onClick={() => navigate(`/projects/${projectId}/tasks`)}
            sx={{
              minWidth: 0,
              width: 25,
              height: 25,
              padding: 0,
              borderRadius: 1,
              color: isDark ? "white" : "black",
              "&:hover": { backgroundColor: isDark ? "#334155" : "#eeeee6" },
            }}
            aria-label="Back to project tasks"
          >
            <ArrowBackRoundedIcon fontSize="small" sx={{ width: 20, height: 20 }} />
          </Button>
        </div>
        <div>
          <h1 className="text-[30px] font-bold text-[#1D3557] dark:text-slate-100">
            {projectTitle ? projectTitle.projectName : "Loading..."}
          </h1>
          {projectTitle?.projectAdmin && (
            <p className="text-sm font-semibold text-[#d97757] mt-1">
              Project Admin: {projectTitle.projectAdmin}
            </p>
          )}
        </div>
      </div>

      <div className="w-full px-5">
        <div className="flex items-center gap-2 mb-4">
          <ViewKanbanRoundedIcon sx={{ color: "#d97757", fontSize: "1.25rem" }} />
          <h2 className="text-lg font-bold text-[#1D3557] dark:text-slate-100">
            Scrum Board
          </h2>
        </div>
        <KanbanBoard projectId={projectId} />
      </div>
    </Stack>
  );
}
