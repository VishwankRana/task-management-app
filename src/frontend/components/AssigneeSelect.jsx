import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '../context/ThemeContext';

export default function AssigneeSelect({ assigneeId, setAssigneeId, members = [] }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isDark } = useTheme();
  const open = Boolean(anchorEl);

  const selectedMember = members.find((m) => m.userId === assigneeId || m.id === assigneeId);
  const label = selectedMember?.name ?? (assigneeId ? 'Selected user' : 'Unassigned');

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = (value) => {
    if (value !== undefined) setAssigneeId(value);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="assignee-button"
        aria-controls={open ? "assignee-menu" : undefined}
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
        {label}
      </Button>

      <Menu
        id="assignee-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(undefined)}
        MenuListProps={{ "aria-labelledby": "assignee-button" }}
        PaperProps={{
          sx: {
            bgcolor: isDark ? "#1e293b" : "#fff",
            color: isDark ? "#e2e8f0" : "#111827",
            border: isDark ? "1px solid #334155" : undefined,
            maxHeight: 240,
          },
        }}
      >
        <MenuItem
          onClick={() => handleClose(null)}
          sx={{ "&:hover": { bgcolor: isDark ? "#263446" : "#f3f4f6" } }}
        >
          Unassigned
        </MenuItem>
        {members.map((member) => (
          <MenuItem
            key={member.userId ?? member.id}
            onClick={() => handleClose(member.userId ?? member.id)}
            sx={{ "&:hover": { bgcolor: isDark ? "#263446" : "#f3f4f6" } }}
          >
            {member.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
