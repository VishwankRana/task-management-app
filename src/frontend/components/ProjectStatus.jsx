import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function ProjectStatusMenu({ projectStatus, setProjectStatus }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value) => {
    if (value) setProjectStatus(value);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="status-button"
        aria-controls={open ? "status-menu" : undefined}
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
        {projectStatus || "Select Status"}
      </Button>

      <Menu
        id="status-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(null)}
        MenuListProps={{
          "aria-labelledby": "status-button",
        }}
      >
        <MenuItem onClick={() => handleClose("Planning")}>Planning</MenuItem>
        <MenuItem onClick={() => handleClose("Active")}>Active</MenuItem>
        <MenuItem onClick={() => handleClose("Completed")}>Completed</MenuItem>
        <MenuItem onClick={() => handleClose("On hold")}>On Hold</MenuItem>
        <MenuItem onClick={() => handleClose("Cancelled")}>Cancelled</MenuItem>
      </Menu>
    </div>
  );
}
