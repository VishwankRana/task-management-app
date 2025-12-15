import Button from '@mui/material/Button';
export default function NewTaskButton({ onClick, ...props }) {
    return (
        <Button
            onClick={onClick}
            {...props}
            variant="contained"
            sx={{
                    background: "#d97757",
                }
            }
        >
            Add Task
        </Button >
    )
}
