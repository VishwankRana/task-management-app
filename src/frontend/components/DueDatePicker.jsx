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
                sx={{
  color: "#374151",
  borderColor: "#374151",
  width: "100%",          
  height: "40px",         
  justifyContent: "flex-start",
  textTransform: "none",
  "&:hover": {
    borderColor: "#374151",
    backgroundColor: "#F3F4F6",
  },
}}
            />
        </LocalizationProvider>
    );
}