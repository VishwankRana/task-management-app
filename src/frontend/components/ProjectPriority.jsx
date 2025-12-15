import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function ProjectPriorityMenu({ projectPriority, setProjectPriority }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value) => {
    if (value) setProjectPriority(value); // update priority when selecting
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Button that shows current priority */}
      <Button
        id="priority-button"
        aria-controls={open ? "priority-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="outlined"
        sx={{
            color: "#374151",        
            borderColor: "#374151",
            "&:hover": {
            borderColor: "#374151",
            backgroundColor: "#F3F4F6", 
        },
  }}
      >
        {projectPriority || "Select Priority"}
      </Button>

      {/* Dropdown menu */}
      <Menu
        id="priority-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(null)}
        MenuListProps={{
          "aria-labelledby": "priority-button",
        }}
      >
        <MenuItem onClick={() => handleClose("Low")}>Low</MenuItem>
        <MenuItem onClick={() => handleClose("Medium")}>Medium</MenuItem>
        <MenuItem onClick={() => handleClose("High")}>High</MenuItem>
        <MenuItem onClick={() => handleClose("Urgent")}>Urgent</MenuItem>
      </Menu>
    </div>
  );
}
