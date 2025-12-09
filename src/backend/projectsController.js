import express from 'express'
import Projects from './projectsDB.js'

const ProjectsRouter = express.Router();

ProjectsRouter.get('/api/taskmanager/projects', async (req, res) => {
    try {
        const allProjects = await Projects.find();
        res.status(200).json(allProjects);
    } catch (err) {
        res.status(500).json({ message: "Error fetching Projects", error: err });
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
        const deletedProject = await Projects.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted", deletedProject });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete project", error: err });
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
        res.status(500).json({ message: "Failed to update project", error: err });
    }
});

export default ProjectsRouter;
