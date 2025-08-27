import { create } from "zustand";
import { groupTasks } from "../utils/groupTasks";

export interface Task {
  task_id: string;
  task_name: string;
  description?: string;
  due_date: string; // ISO date string
  status: string;
  priority?: string;
  category?: string;
}

interface TaskState {
  tasks: Task[];
  groupedTasks: Record<string, Task[]>;
  fetchTasks: () => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  groupedTasks: {},
  fetchTasks: async () => {
    try {
      const res = await fetch("/db/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: "SELECT * FROM tasks", params: [] }),
      });
      const data = await res.json();
      const tasks: Task[] = data.map((row: any) => ({
        task_id: row.task_id,
        task_name: row.task_name,
        description: row.description,
        due_date: row.due_date,
        status: row.status,
        priority: row.priority,
        category: row.category,
      }));
      set({ tasks, groupedTasks: groupTasks(tasks) });
    } catch (e) {
      console.error("Failed to fetch tasks", e);
    }
  },
  updateTask: async (id, updates) => {
    try {
      const fields = Object.keys(updates)
        .map((k) => `${k} = ?`)
        .join(", ");
      const values = Object.values(updates);
      await fetch("/db/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: `UPDATE tasks SET ${fields} WHERE task_id = ?`,
          params: [...values, id],
        }),
      });
      // Refresh after update
      await get().fetchTasks();
    } catch (e) {
      console.error("Failed to update task", e);
    }
  },
}));