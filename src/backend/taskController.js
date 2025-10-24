import express from 'express';
import Tasks from '../backend/taskDB.js';

const router = express.Router();

router.get('/api/taskmanager/task', async (req, res) => {
    try {
        const allTasks = await Tasks.find();
        res.status(200).json(allTasks);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching Tasks", error: err })
    }
});

router.post('/api/taskmanager/task', async (req, res) => {
    try {
        const newTask = new Tasks(req.body);
        const saveTask = await newTask.save();

        res.status(201).json(saveTask)
    }
    catch (error) {
        console.error('Full error:', error);
        console.error('Error name:', error.name);
        res.status(500).json({
            message: "Error Updating the Task", error: error.message,
            details: error.errors
        })
    }
})

router.delete('/api/taskmanager/task/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTasks = await Tasks.findByIdAndDelete(id);

        if (!deleteTasks) {
            return res.status(404).json({ message: "Tasks not found" })
        }
        res.status(200).json({ message: "Task Deleted", deleteTasks })
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete task", error })
    }
})

router.put('/api/taskmanager/task/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTasks = await Tasks.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (!updatedTasks)
            return res.status(404).json({ message: "Task not found" })
        res.status(200).json(updatedTasks);
    }

    catch (error) {
        res.status(500).json({ message: "Failed to update task", error })
    }
})

export default router