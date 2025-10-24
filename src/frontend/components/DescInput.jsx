import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function DescriptionInput({ value, onChange }) {
    return (
        <Box>
            <TextField id="outlined-basic" variant="outlined"
                label="Description"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                multiline="true"
                rows={4}
                fullwidth="true" />
        </Box>
    );
}