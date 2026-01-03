import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function TaskTypeMenu({ taskType, setTaskType }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value) => {
    if (value) setTaskType(value);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="taskType-button"
        aria-controls={open ? "taskType-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="outlined"
        sx={{
  color: "#374151",
  borderColor: "#374151",
  width: "100%",          
  height: "40px",         
  justifyContent: "flex-start",
  borderRadius: "8px",
  marginTop: "6px",
  textTransform: "none",
  "&:hover": {
    borderColor: "#374151",
    backgroundColor: "#F3F4F6",
  },
}}
      >
        {taskType || "Select Type"}
      </Button>

      <Menu
        id="taskType-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(null)}
        MenuListProps={{
          "aria-labelledby": "taskType-button",
        }}
      >
        <MenuItem onClick={() => handleClose("Bug")} >Bug</MenuItem>
        <MenuItem onClick={() => handleClose("Feature") }>Feature</MenuItem>
        <MenuItem onClick={() => handleClose("Task")} >Task</MenuItem>
        <MenuItem onClick={() => handleClose("Improvement")} >Improvement</MenuItem>
        <MenuItem onClick={() => handleClose("Other")} >Other</MenuItem>
      </Menu>
    </div>
  );
}