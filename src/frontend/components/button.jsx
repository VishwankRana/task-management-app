import { Button } from '@mui/material';
export default function NewTaskButton({ onClick, ...props }) {
    return (
        <Button
            onClick={onClick}
            {...props}
            sx={{
                backgroundColor: '#F06543',
                color: 'white',
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '8px',
                '&:hover': {
                    backgroundColor: '#F09D51',
                }
            }}
        >
            Add Task
        </Button >
    )
}
