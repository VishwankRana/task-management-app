import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteTaskBtn({ onDelete }) {
    return (
        <Button size='small' startIcon={<DeleteIcon />} onClick={onDelete}
            sx={{
                backgroundColor: '#fc0303',
                color: 'white',
                '&:hover': {
                    backgroundColor: '#d40209'
                }

            }}>
            Delete
        </Button>
    )
}