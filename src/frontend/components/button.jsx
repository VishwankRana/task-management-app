import { Button } from '@mui/material';
export default function NewTaskButton({ onClick, ...props }) {
    return (
        <Button
            onClick={onClick}
            {...props}
            sx={{
                backgroundColor: '#5340f7',
                color: 'white',
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '8px',
                '&:hover': {
                    backgroundColor: '#4515d4',
                }
            }}
        >
            Add Task
        </Button >
    )
}
