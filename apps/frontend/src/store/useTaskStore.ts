import { create } from "zustand";
import { Task, tasks as initialTasks } from '../data/tasks';

interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
}

interface TaskState {
  tasks: Task[];
  log: LogEntry[];
  xp: number;
  streak: number;
  markComplete: (id: string) => void;
  addTask: (title: string, due: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: initialTasks,
  log: [],
  xp: 0,
  streak: 0,
  markComplete: (id) => {
    set((state) => {
      const updated = state.tasks.map((t) =>
        t.id === id ? { ...t, completed: true } : t
      );
      const completedCount = updated.filter((t) => t.completed).length;
      const newXP = state.xp + 10;
      const today = new Date().toISOString().split('T')[0];
      const streak = updated.some(
        (t) => t.completed && t.due.startsWith(today)
      )
        ? state.streak + 1
        : state.streak;
      return {
        tasks: updated,
        xp: newXP,
        streak,
        log: [
          ...state.log,
          { id: id + Date.now(), message: `✅ Completed task: ${id}`, timestamp: new Date().toISOString() },
        ],
      };
    });
  },
  addTask: (title, due) => {
    set((state) => {
      const newTask: Task = { id: Date.now().toString(), title, due, status: 'Todo' };
      return {
        tasks: [...state.tasks, newTask],
        log: [
          ...state.log,
          { id: newTask.id, message: `➕ Added task: ${title}`, timestamp: new Date().toISOString() },
        ],
      };
    });
  },
}));
