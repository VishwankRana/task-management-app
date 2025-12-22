import { useState, useEffect } from 'react';
import { Button,IconButton } from '@mui/material';
import { useParams } from "react-router-dom";
import axios from 'axios';
import CloseIcon from "@mui/icons-material/Close";
import PrioritySelect from './PrioritySelect';
import StatusSelect from './StatusSelect';
import EditTaskBtn from './EditTaskBtn';


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

export default function EditTaskModal({ task, setTaskList }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [dueDate, setDueDate] = useState("");
    
    const { projectId } = useParams();

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setTitle("");
        setDescription("");
        setPriority("");
        setStatus("");
        setDueDate("");
    };

    useEffect(() =>{
        if( open && task ){
            setTitle(task.title || " ");
            setDescription(task.description || " ");;
            setPriority(task.priority || " ");
            setStatus(task.status || " ");
            // setDueDate(task.dueDate || " ");
            setDueDate(task.dueDate?.slice(0, 10) || "")
        }
    }, [open,task])

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
        if (!dueDate) {
            alert('Please select a due date');
            return;
        }

        const TaskData = {
            title: title.trim(),
            description,
            priority,
            status,
            dueDate
        };

        try {
          let response;
          if (task && task._id) {
            response = await axios.put(`http://localhost:3000/api/taskmanager/tasks/${task._id}`, TaskData);
            setTaskList((prev) => prev.map((t) => (t._id === response.data._id ? response.data : t)));
            alert('Task updated successfully!');
          } 
          
          console.log("Task request successful", response.data);
          handleClose();
        }
        catch (err) {
          console.error('Error saving task:', err);
          const errorMessage = err.response?.data?.message || err.message;
          alert(`Failed to save task. Please try again: ${errorMessage}`);
        }
    };

    return (
        <>
        <EditTaskBtn onClick={handleOpen} /> 
        {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="w-[450px] bg-white shadow-xl rounded-xl p-6 border border-gray-200 mx-auto">
            <div className="w-full flex items-center justify-between">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Edit Task</h1>
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
              
                <div className="flex justify-between mb-2">
                    <div>
                    <label htmlFor="status" className="font-medium text-gray-700">
                      Status
                    </label>
                    <StatusSelect status={status} setStatus={setStatus}/>
                    </div>
        
                    <div>
                    <label htmlFor="priority" className="font-medium text-gray-700">
                      Priority
                    </label>
                    <PrioritySelect priority={priority} setPriority={setPriority}/>
                    </div>
                </div>
    
              <div>
                   <label htmlFor="DueDate" className="block font-medium text-gray-700">
                     Due Date
                   </label>
                   <input
                     type="date"
                     id="DueDate"
                     className="w-full p-2 border rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                     value={dueDate}
                     onChange={(e) => setDueDate(e.target.value)}
                   />
               </div>
              </div>
    
              <div className="flex justify-end w-full">
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: "#db7657",
                    paddingY: "12px",
                    "&:hover": { backgroundColor: "#c65d3e" },
                  }}
                >
                  Edit Task
                </Button>
              </div>
            </form>
          </div>
        </div>
        )}
        </>
      );
}

