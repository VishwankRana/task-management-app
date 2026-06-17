import express from 'express';
import prisma from './projectsDB.js';
import { authenticate } from './middleware/authenticate.js';
import { authorize } from './middleware/authorize.js';
import { getProjectAccess, requireProjectAccess, requireProjectOwner } from './middleware/projectAccess.js';

const ProjectsRouter = express.Router();

const projectInclude = {
    owner: { select: { id: true, name: true } },
    members: {
        include: {
            user: { select: { id: true, name: true, email: true, role: true } },
        },
    },
};

const formatMember = (member) => ({
    id: member.id,
    userId: member.userId,
    name: member.user.name,
    email: member.user.email,
    role: member.user.role,
    addedAt: member.createdAt,
});

const formatProject = (project) => {
    if (!project) return null;
    const { owner, members, ...rest } = project;
    return {
        ...rest,
        _id: rest.id,
        projectAdmin: owner?.name ?? null,
        ownerName: owner?.name ?? null,
        members: members?.map(formatMember) ?? [],
    };
};

ProjectsRouter.use(authenticate);

ProjectsRouter.get('/api/taskmanager/users/search', authorize('Admin'), async (req, res) => {
    try {
        const q = req.query.q?.trim() ?? '';
        const projectId = req.query.projectId ? Number(req.query.projectId) : null;

        if (q.length < 2) {
            return res.status(200).json([]);
        }

        const existingMemberIds = projectId
            ? (await prisma.projectMember.findMany({
                where: { projectId },
                select: { userId: true },
            })).map((m) => m.userId)
            : [];

        const project = projectId
            ? await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } })
            : null;

        const excludeIds = [...new Set([...existingMemberIds, project?.ownerId].filter(Boolean))];

        const users = await prisma.user.findMany({
            where: {
                role: 'User',
                id: excludeIds.length ? { notIn: excludeIds } : undefined,
                OR: [
                    { name: { contains: q } },
                    { email: { contains: q } },
                ],
            },
            select: { id: true, name: true, email: true, role: true },
            take: 10,
            orderBy: { name: 'asc' },
        });

        res.status(200).json(users);
    } catch (err) {
        console.error('User search error:', err);
        res.status(500).json({ message: 'Failed to search users', error: err.message });
    }
});

ProjectsRouter.get('/api/taskmanager/projects/', async (req, res) => {
    try {
        const where =
            req.user.role === 'Admin'
                ? { ownerId: req.user.id }
                : { members: { some: { userId: req.user.id } } };

        const allProjects = await prisma.project.findMany({
            where,
            include: projectInclude,
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(allProjects.map(formatProject));
    } catch (err) {
        res.status(500).json({ message: "Error fetching Projects", error: err });
    }
});

ProjectsRouter.get('/api/taskmanager/projects/:id', async (req, res) => {
    try {
        const projectId = Number(req.params.id);
        const access = await requireProjectAccess(req.user, projectId);

        if (!access) {
            return res.status(403).json({ message: "You do not have access to this project" });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: projectInclude,
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(formatProject(project));
    } catch (err) {
        console.error("Get project error:", err);
        res.status(500).json({
            message: "Failed to fetch project",
            error: err.message
        });
    }
});

ProjectsRouter.get('/api/taskmanager/projects/:id/members', async (req, res) => {
    try {
        const projectId = Number(req.params.id);
        const access = await requireProjectOwner(req.user, projectId);

        if (!access) {
            return res.status(403).json({ message: "Only the project admin can view members" });
        }

        const members = await prisma.projectMember.findMany({
            where: { projectId },
            include: {
                user: { select: { id: true, name: true, email: true, role: true } },
            },
            orderBy: { createdAt: 'asc' },
        });

        res.status(200).json(members.map(formatMember));
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch project members", error: err.message });
    }
});

ProjectsRouter.post('/api/taskmanager/projects/:id/members', authorize('Admin'), async (req, res) => {
    try {
        const projectId = Number(req.params.id);
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const access = await requireProjectOwner(req.user, projectId);
        if (!access) {
            return res.status(403).json({ message: "Only the project admin can add members" });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { ownerId: true },
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.ownerId === Number(userId)) {
            return res.status(400).json({ message: "Project admin is already part of this project" });
        }

        const targetUser = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { id: true, name: true, email: true, role: true },
        });

        if (!targetUser || targetUser.role !== 'User') {
            return res.status(400).json({ message: "Only registered users can be added to a project" });
        }

        const existing = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: { projectId, userId: Number(userId) },
            },
        });

        if (existing) {
            return res.status(409).json({ message: "User is already a member of this project" });
        }

        const member = await prisma.projectMember.create({
            data: { projectId, userId: Number(userId) },
            include: {
                user: { select: { id: true, name: true, email: true, role: true } },
            },
        });

        res.status(201).json(formatMember(member));
    } catch (err) {
        console.error('Add member error:', err);
        res.status(500).json({ message: "Failed to add project member", error: err.message });
    }
});

ProjectsRouter.post('/api/taskmanager/projects', authorize('Admin'), async (req, res) => {
    try {
        const savedProject = await prisma.project.create({
            data: {
                ...req.body,
                ownerId: req.user.id,
            },
            include: projectInclude,
        });
        res.status(201).json(formatProject(savedProject));
    } catch (err) {
        res.status(500).json({ message: "Error adding new project", error: err });
    }
});

ProjectsRouter.delete('/api/taskmanager/projects/:id', authorize('Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const numId = Number(id);

        const project = await prisma.project.findUnique({ where: { id: numId } });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Only the project admin can delete this project" });
        }

        await prisma.projectMember.deleteMany({ where: { projectId: numId } });
        const deletedTasks = await prisma.task.deleteMany({ where: { projectId: numId } });
        const deletedProject = await prisma.project.delete({ where: { id: numId } });

        res.status(200).json({
            message: "Project and related tasks deleted",
            deletedProjects: formatProject(deletedProject),
            deletedTasks
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete project", error: err.message });
    }
});

ProjectsRouter.put('/api/taskmanager/projects/:id', authorize('Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const numId = Number(id);

        const project = await prisma.project.findUnique({ where: { id: numId } });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Only the project admin can update this project" });
        }

        const updatedProject = await prisma.project.update({
            where: { id: numId },
            data: req.body,
            include: projectInclude,
        });

        res.status(200).json({ message: "Project updated", updatedProject: formatProject(updatedProject) });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Project not found" });
        }
        console.error("Update error:", err);
        res.status(500).json({ message: "Failed to update project", error: err.message || err });
    }
});

export default ProjectsRouter;
