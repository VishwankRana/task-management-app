export function applyTimeTrackingOnStatusChange(existingTask, newStatus) {
    const updates = {};
    const now = new Date();

    if (
        newStatus === 'In-progress'
        && existingTask.status === 'Pending'
        && !existingTask.startedAt
    ) {
        updates.startedAt = now;
    }

    if (newStatus === 'Completed' && existingTask.status !== 'Completed') {
        updates.completedAt = now;

        if (existingTask.startedAt) {
            const startedMs = new Date(existingTask.startedAt).getTime();
            updates.timeSpent = Math.max(0, Math.floor((now.getTime() - startedMs) / 1000));
        } else {
            updates.timeSpent = 0;
        }
    }

    return updates;
}
