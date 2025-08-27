import { Task } from "../store/useTaskStore";

export function groupTasks(tasks: Task[]): Record<string, Task[]> {
  const groups: Record<string, Task[]> = {
    Overdue: [],
    Today: [],
    Tomorrow: [],
    "This Week": [],
    "Next Week": [],
    "This Month": [],
  };

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const nextWeekStart = new Date(endOfWeek);
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 7);

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  for (const task of tasks) {
    const due = new Date(task.due_date);
    if (!task.due_date) continue;

    if (due < today && task.status !== "Complete") {
      groups.Overdue.push(task);
    } else if (due.toDateString() === today.toDateString()) {
      groups.Today.push(task);
    } else {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      if (due.toDateString() === tomorrow.toDateString()) {
        groups.Tomorrow.push(task);
      } else if (due >= startOfWeek && due < endOfWeek) {
        groups["This Week"].push(task);
      } else if (due >= nextWeekStart && due < nextWeekEnd) {
        groups["Next Week"].push(task);
      } else if (due <= endOfMonth) {
        groups["This Month"].push(task);
      }
    }
  }

  return groups;
}