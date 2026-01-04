import { useState } from 'react';
import { Button } from '@mui/material';
import { IconButton } from "@mui/material";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import axios from 'axios';
import NewTaskButton from './NewTaskBtn';
import PrioritySelect from './PrioritySelect';
import TaskStatusMenu from './StatusSelect';
import TaskTypeMenu from './TypeSelect';


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
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [taskType, setTaskType] = useState("");
    
    const { projectId } = useParams();

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setTitle("");
        setDescription("");
        setPriority("");
        setStatus("");
        setDueDate("");
        setTaskType("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            alert('Please enter a task title');
            return;
        }
        if (!priority) {
            alert('Please select a priority');
            return;
        }
        if (!status) {
            alert('Please select a status');
            return;
        }

        if (!taskType) {
            alert('Please select a task type');
            return;
        }

        if (!dueDate) {
            alert('Please select a due date');
            return;
        }

        const TaskData = {
          title: title.trim(),
          description,
          priority,
          status,
          type: taskType,
          dueDate
        };

        try {
            const response = await axios.post(`http://localhost:3000/api/taskmanager/projects/${projectId}/tasks`, TaskData); 
            console.log("Task Data Submitted Successfully", response.data);
            setTaskList((prev) => [...prev, response.data]);
            alert('Task created successfully!');
            handleClose();
        }
        catch (err) {
            console.error('Error creating task:', err.message);
            const errorMessage = err.response?.data?.message || err.message;
            alert(`Failed to create task. Please try again: ${errorMessage}`);
        }
    };

    return (
        <>
        <NewTaskButton onClick={handleOpen} />
        {open && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/40">
          <div className="w-[450px] bg-white shadow-xl rounded-xl p-6 border border-gray-200 mx-auto">
            <div className="w-full flex items-center justify-between">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Create a New Task</h1>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
    
            <form onSubmit={handleSubmit}>
              <div>
              <div>
              <label htmlFor="taskName" className="block font-medium text-gray-700">
                  Task Name
              </label>
              <input
                  type="text"
                  id="taskName"
                  className="w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter Task name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
              />
              </div>
    
               <div>
                    <label htmlFor="description" className="block font-medium text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      className="w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Describe your project"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
               </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">

  <div>
    <label className="font-medium text-gray-700">Status</label>
    <TaskStatusMenu status={status} setStatus={setStatus} />
  </div>

  <div>
    <label className="font-medium text-gray-700">Priority</label>
    <PrioritySelect priority={priority} setPriority={setPriority} />
  </div>

  <div>
    <label className="font-medium text-gray-700">Type</label>
    <TaskTypeMenu taskType={taskType} setTaskType={setTaskType} />
  </div>

  <div>
    <label className="font-medium text-gray-700">Due Date</label>
    <input
      type="date"
      id="DueDate"
      className="w-full p-2 border rounded-lg mt-1 mb-3
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={dueDate}
      onChange={(e) => setDueDate(e.target.value)}
    />
  </div>

</div>
                </div>
    
              <div className="flex  justify-end w-full">
                <Button
      type='submit'
      variant="contained"
      sx={{
        px: 3,
        py: 1,
        textTransform: "none",
        fontWeight: 700,
        borderRadius: "999px",
        backgroundColor: "#d97757",
        boxShadow: "0 4px 10px rgba(217,119,87,0.25)",
        "& .MuiSvgIcon-root": {
          fontSize: "1.2rem",
        },
        "&:hover": {
          backgroundColor: "#c76546",
          boxShadow: "0 6px 14px rgba(217,119,87,0.35)",
        },
      }}
    >
      Create Task
    </Button>
              </div>
            </form>
          </div>
        </div>
        )}
        </>
      );
}
