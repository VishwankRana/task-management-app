import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import EditTaskModal from "./EditTaskModal"

export default function EditTaskBtn({ onClick, ...props }) {

    return (

        <Button startIcon={<EditIcon />}
         onClick={onClick}
        {...props}
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

