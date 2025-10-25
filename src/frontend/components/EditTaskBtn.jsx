import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';

export default function EditTaskBtn() {
    return (

        <Button startIcon={<EditIcon />}
            sx={{
                backgroundColor: '#1976D2',
                color: 'white',
                '&:hover': {
                    backgroundColor: '#0e5dab'
                }
            }}>
            Edit
        </Button>
    )
}

