import { useState } from "react";
import useTasks from "../hooks/useTasks";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import SpeedDial from "@mui/material/SpeedDial";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MyTasksSummary from "../TasksSummary/MyTasksSummary";

export default function MyTasksTile() {
  const { totalTasks, loading } = useTasks();
  const [open, setOpen] = useState(false);

  return (
    <div className="w-70 p-5 rounded-2xl border border-[#343a8d] bg-[#e9ecff] shadow-md hover:shadow-lg transition-all duration-200">

      <div className="flex items-center justify-between">
        <p className="text-l font-semibold text-[#2a2f75]">
          My Tasks
        </p>

        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box sx={{ position: "relative" }}>
            <Grow
              in={open}
              timeout={250}
              style={{ transformOrigin: "top right" }}
              unmountOnExit
            >
              <Box sx={{ position: "absolute", top: "110%", right: 0, zIndex: 1300 }}>
                <MyTasksSummary />
              </Box>
            </Grow>
            <SpeedDial
              ariaLabel="My Tasks Summary"
              icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
              open={false}
              FabProps={{
                onClick: () => setOpen((prev) => !prev),
                size: "small",
              }}
              sx={{
                "& .MuiSpeedDial-fab": {
                  width: 36,
                  height: 36,
                  minHeight: 36,
                  bgcolor: "#343a8d",
                  "&:hover": { bgcolor: "#2a2f75" },
                  boxShadow: "0 2px 6px rgba(52,58,141,0.35)",
                  borderRadius: "12px",
                },
              }}
            />
          </Box>
        </ClickAwayListener>
      </div>

      <h2 className="text-4xl font-extrabold text-[#1f2463] mt-1">
        {loading ? "…" : totalTasks}
      </h2>

      <p className="text-xs font-medium text-[#2a2f75] mt-1">
        assigned to me
      </p>

    </div>
  );
}
