import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import axios from 'axios';
import NewTaskButton from './NewTaskBtn';
import PrioritySelect from './PrioritySelect';
import StatusSelect from './StatusSelect';
import DueDatePicker from './DueDatePicker';
import TextField from './TitleText';
import DescriptionInput from './DescInput';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};

export default function NewTaskModal({ setTaskList }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [dueDate, setDueDate] = useState("");

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setTitle("");
        setDescription("");
        setPriority("");
        setStatus("");
        setDueDate("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const TaskData = {
            title,
            description,
            priority,
            status,
            dueDate
        };

        try {
            const response = await axios.post("http://localhost:3000/api/taskmanager/task", TaskData);
            console.log("Task Data Submitted Successfully", response.data);
            setTaskList((prev) => [...prev, response.data]);
            alert('Task created successfully!');
            handleClose();
        }
        catch (err) {
            console.error('Error creating task:', err);
            const errorMessage = err.response?.data?.message || err.message;
            alert(`Failed to create task. Please try again: ${errorMessage}`);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NewTaskButton onClick={handleOpen} />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
            >
                <Box sx={style}>
                    <Typography id="modal-title" variant="h5" component="h2" mb={3}>
                        Create New Task
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                value={title}
                                onChange={setTitle}
                            />

                            <DescriptionInput
                                value={description}
                                onChange={setDescription}
                            />

                            <PrioritySelect
                                value={priority}
                                onChange={setPriority}
                            />

                            <StatusSelect
                                value={status}
                                onChange={setStatus}
                            />

                            <DueDatePicker
                                value={dueDate}
                                onChange={setDueDate}
                            />

                            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                                <Button
                                    onClick={handleClose}
                                    variant="outlined"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: '#5340f7',
                                        '&:hover': {
                                            backgroundColor: '#4515d4'
                                        }
                                    }}
                                >
                                    {loading ? 'Creating...' : 'Create Task'}
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}