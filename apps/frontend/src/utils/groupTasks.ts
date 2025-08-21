import { Task } from '../data/tasks.ts';

export type GroupedTasks = {
  today: Task[];
  tomorrow: Task[];
  thisWeek: Task[];
  later: Task[];
};

export function groupTasks(tasks: Task[]): GroupedTasks {
  const now = new Date();
  const today = tasks.filter(t => new Date(t.dueDate).toDateString() === now.toDateString());

  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const tomorrow = tasks.filter(t => new Date(t.dueDate).toDateString() === tomorrowDate.toDateString());

  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + (7 - now.getDay()));
  const thisWeek = tasks.filter(t => {
    const d = new Date(t.dueDate);
    return d > tomorrowDate && d <= weekEnd;
  });

  const later = tasks.filter(t => !today.includes(t) && !tomorrow.includes(t) && !thisWeek.includes(t));

  return { today, tomorrow, thisWeek, later };
}