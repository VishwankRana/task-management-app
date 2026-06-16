import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '../context/ThemeContext';

export default function PrioritySelect({ priority, setPriority }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isDark } = useTheme();
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
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
          color: isDark ? "#cbd5e1" : "#374151",
          borderColor: isDark ? "#475569" : "#374151",
          width: "100%",
          height: "40px",
          justifyContent: "flex-start",
          borderRadius: "8px",
          marginTop: "5px",
          textTransform: "none",
          "&:hover": {
            borderColor: isDark ? "#64748b" : "#374151",
            backgroundColor: isDark ? "#263446" : "#F3F4F6",
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
        MenuListProps={{ "aria-labelledby": "priority-button" }}
        PaperProps={{
          sx: {
            bgcolor: isDark ? "#1e293b" : "#fff",
            color: isDark ? "#e2e8f0" : "#111827",
            border: isDark ? "1px solid #334155" : undefined,
          },
        }}
      >
        {["Low", "Medium", "High", "Urgent"].map((p) => (
          <MenuItem
            key={p}
            onClick={() => handleClose(p)}
            sx={{ "&:hover": { bgcolor: isDark ? "#263446" : "#f3f4f6" } }}
          >
            {p}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
