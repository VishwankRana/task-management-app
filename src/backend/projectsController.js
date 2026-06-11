import express from 'express';
import prisma from './projectsDB.js';

const ProjectsRouter = express.Router();

const withId = (obj) => obj ? { ...obj, _id: obj.id } : null;

ProjectsRouter.get('/api/taskmanager/projects/', async (req, res) => {
    try {
        const allProjects = await prisma.project.findMany();
        res.status(200).json(allProjects.map(withId));
    } catch (err) {
        res.status(500).json({ message: "Error fetching Projects", error: err });
    }
});

ProjectsRouter.get('/api/taskmanager/projects/:id', async (req, res) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: Number(req.params.id) }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(withId(project));
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
        const savedProject = await prisma.project.create({ data: req.body });
        res.status(201).json(withId(savedProject));
    } catch (err) {
        res.status(500).json({ message: "Error adding new project", error: err });
    }
});

ProjectsRouter.delete('/api/taskmanager/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const numId = Number(id);

        const project = await prisma.project.findUnique({ where: { id: numId } });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const deletedTasks = await prisma.task.deleteMany({ where: { projectId: numId } });
        const deletedProject = await prisma.project.delete({ where: { id: numId } });

        res.status(200).json({
            message: "Project and related tasks deleted",
            deletedProjects: withId(deletedProject),
            deletedTasks
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete project", error: err.message });
    }
});

ProjectsRouter.put('/api/taskmanager/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const updatedProject = await prisma.project.update({
            where: { id: Number(id) },
            data: req.body
        });

        res.status(200).json({ message: "Project updated", updatedProject: withId(updatedProject) });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Project not found" });
        }
        console.error("Update error:", err);
        res.status(500).json({ message: "Failed to update project", error: err.message || err });
    }
});

export default ProjectsRouter;
