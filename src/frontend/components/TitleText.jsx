import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function TitleTextField({ value, onChange }) {
    return (
        <Box>
            <TextField id="outlined-basic" variant="outlined"
                label="Title"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                fullwidth="true"
                required />
        </Box>
    );
}