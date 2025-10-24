import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DueDatePicker({ value, onChange }) {
    const handleChange = (newValue) => {
        const formatted = newValue ? newValue.toISOString() : '';
        onChange(formatted);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="Due Date"
                value={value ? dayjs(value) : null}
                onChange={handleChange}
                slotProps={{ textField: { fullWidth: true } }}
            />
        </LocalizationProvider>
    );
}