import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

export default function NewTaskButton({ onClick, ...props }) {
  return (
    <Button
      onClick={onClick}
      {...props}
      variant="contained"
      startIcon={<AddCircleRoundedIcon />}
      sx={{
        px: 3,
        py: 1,
        textTransform: "none",
        fontWeight: 700,
        borderRadius: "999px",
        backgroundColor: "#d97757",
        boxShadow: "0 4px 10px rgba(217,119,87,0.25)",
        "& .MuiSvgIcon-root": {
          fontSize: "1.2rem",
        },
        "&:hover": {
          backgroundColor: "#c76546",
          boxShadow: "0 6px 14px rgba(217,119,87,0.35)",
        },
      }}
    >
      Add Task
    </Button>
  );
}
