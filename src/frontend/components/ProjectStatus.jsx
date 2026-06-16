import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '../context/ThemeContext';

export default function ProjectStatusMenu({ projectStatus, setProjectStatus }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isDark } = useTheme();
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
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
          color: isDark ? "#cbd5e1" : "#374151",
          borderColor: isDark ? "#475569" : "#374151",
          "&:hover": {
            borderColor: isDark ? "#64748b" : "#374151",
            backgroundColor: isDark ? "#263446" : "#F3F4F6",
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
        MenuListProps={{ "aria-labelledby": "status-button" }}
        PaperProps={{
          sx: {
            bgcolor: isDark ? "#1e293b" : "#fff",
            color: isDark ? "#e2e8f0" : "#111827",
            border: isDark ? "1px solid #334155" : undefined,
          },
        }}
      >
        {["Planning", "Active", "In Progress", "Completed", "On Hold", "Cancelled"].map((s) => (
          <MenuItem
            key={s}
            onClick={() => handleClose(s)}
            sx={{ "&:hover": { bgcolor: isDark ? "#263446" : "#f3f4f6" } }}
          >
            {s}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
