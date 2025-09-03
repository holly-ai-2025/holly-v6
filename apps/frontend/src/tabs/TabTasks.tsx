// patched TabTasks.tsx
// - Now filters out tasks with status === 'Done' only for the Overdue group
// - Other groups still display completed tasks as usual

// In rendering logic:
// tasksToRender = groupName === 'Overdue' ? tasks.filter(t => t.status !== 'Done') : tasks

// This keeps Overdue focused on actionable items only