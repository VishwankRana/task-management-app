import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';



export default function PrioritySelect({ priority, setPriority }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value) => {
    if (value) setPriority(value); 
    setAnchorEl(null);
  };

  return (
    <div>
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
  width: "100%",          // <-- align width
  height: "40px",         // <-- match input height
  justifyContent: "flex-start",
  borderRadius: "8px",
  marginTop: "5px",
  textTransform: "none",
  "&:hover": {
    borderColor: "#374151",
    backgroundColor: "#F3F4F6",
  },
}}
      >
        {priority || "Select Priority"}
      </Button>

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