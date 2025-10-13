import mongoose from "mongoose";

const tasksSchema = mongoose.Schema({
    taskTitle: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },

    taskDescription: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    taskDueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },

    taskPriority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: {
            values: ['low', 'medium', 'high', 'urgent'],
        },
        default: 'medium'
    },

    taskStatus: {
        type: String,
        required: true,
        enum: {
            values: ['pending', 'in-progress', 'completed', 'cancelled'],
        },
        default: 'pending'
    }
}, {
    timestamps: true
});

const Tasks = mongoose.model("Task", tasksSchema);

export default Tasks;