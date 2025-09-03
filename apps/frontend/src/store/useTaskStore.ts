import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Task type
export interface Task {
  id: string;
  name: string;
  due_date: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  project?: string | null;
  category?: string | null;
  token_value?: number | null;
}

// Store state
interface TaskState {
  tasks: Task[];
  log: string[];
  xp: number;
  streak: number;
  addTask: (task: Task) => void;
  setTasks: (tasks: Task[]) => void;
  addLog: (entry: string) => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
}

// Create store
export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [], // start empty, will be populated by DB fetch
      log: [],
      xp: 0,
      streak: 0,
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      setTasks: (tasks) => set({ tasks }),
      addLog: (entry) => set((state) => ({ log: [...state.log, entry] })),
      addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
    }),
    {
      name: 'task-storage',
    }
  )
);