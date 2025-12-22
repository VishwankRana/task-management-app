import express from 'express'
import Projects from './projectsDB.js'
import Tasks from "./taskDB.js"

const ProjectsRouter = express.Router();

ProjectsRouter.get('/api/taskmanager/projects/', async (req, res) => {
    try {
        const allProjects = await Projects.find();
        res.status(200).json(allProjects);
    } catch (err) {
        res.status(500).json({ message: "Error fetching Projects", error: err });
    }
});

ProjectsRouter.get('/api/taskmanager/projects/:id', async (req, res) => {
    try {
        const project = await Projects.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(project);
    } catch (err) {
        console.error("Get project error:", err);
        res.status(500).json({
            message: "Failed to fetch project",
            error: err.message
        });
    }
});

ProjectsRouter.post('/api/taskmanager/projects', async (req, res) => {
    try {
        const newProject = new Projects(req.body);
        const savedProject = await newProject.save();

        res.status(201).json(savedProject);
    } catch (err) {
        res.status(500).json({ message: "Error adding new project", error: err });
    }
});

ProjectsRouter.delete('/api/taskmanager/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Projects.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const deletedTasks = await Tasks.deleteMany({ projectId: id});
        const deletedProjects = await Projects.findByIdAndDelete(id);

        res.status(200).json({ message: "Project and related tasks deleted", deletedProjects,deletedTasks });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete project", error: err.message });
    }
});

ProjectsRouter.put('/api/taskmanager/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const updatedProject = await Projects.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project updated", updatedProject });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Failed to update project", error: err.message || err });
    }
});

export default ProjectsRouter;
