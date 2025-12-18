import mongoose from "mongoose";

const tasksSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },

    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },

    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: {
            values: ['Low', 'Medium', 'High', 'Urgent'],
        },
        default: 'Medium'
    },

    status: {
        type: String,
        required: true,
        enum: {
            values: ['Pending', 'In-progress', 'Completed', 'Cancelled'],
        },
        default: 'Pending'
    },

    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    }

}, {
    timestamps: true
});

const Tasks = mongoose.model("Task", tasksSchema);

export default Tasks;