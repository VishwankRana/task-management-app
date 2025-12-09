import mongoose from "mongoose";

const projectsSchema = mongoose.Schema({

        projectName: {
            type: String,
            required: [true, 'Project title is required'],
            trim: true,
            maxlength: [100, 'Project Name cannot exceed 100 characters']
        },

        projectDescription: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },

        projectStatus:{
            type: String,
            enum: ['Planning', 'Active', 'Completed', 'On hold', 'Cancelled']
        },

        projectPriority:{
            type: String,
            enum: ['low', 'medium', 'high', 'urgent']
        },

        projectStartDate: {
            type: Date,
            required: [true, 'Start date is required']
        },

        projectEndDate:{
            type: Date,
            required: [true, 'End date is required']
        }
}, 
{
    timestamps: true
})

const Projects = mongoose.model("Project", projectsSchema);

export default Projects;