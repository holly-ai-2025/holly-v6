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

const API_BASE = import.meta.env.VITE_API_URL || "/db";
console.log("[TaskStore] Using API_BASE:", API_BASE);

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  groupedTasks: {},
  fetchTasks: async () => {
    try {
      console.log("[TaskStore] Fetching tasks from", `${API_BASE}/query`);
      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: "SELECT * FROM tasks", params: [] }),
      });
      console.log("[TaskStore] Response status:", res.status);
      const data = await res.json();
      console.log("[TaskStore] Raw data from DB:", data);

      const tasks: Task[] = data.map((row: any) => ({
        task_id: row.task_id,
        task_name: row.task_name,
        description: row.description,
        due_date: row.due_date,
        status: row.status,
        priority: row.priority,
        category: row.category,
      }));

      console.log("[TaskStore] Normalized tasks:", tasks);
      const grouped = groupTasks(tasks);
      console.log("[TaskStore] Grouped tasks:", grouped);

      set({ tasks, groupedTasks: grouped });
    } catch (e) {
      console.error("[TaskStore] Failed to fetch tasks", e);
    }
  },
  updateTask: async (id, updates) => {
    try {
      console.log("[TaskStore] Updating task", id, updates);
      const fields = Object.keys(updates)
        .map((k) => `${k} = ?`)
        .join(", ");
      const values = Object.values(updates);
      await fetch(`${API_BASE}/exec`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: `UPDATE tasks SET ${fields} WHERE task_id = ?`,
          params: [...values, id],
        }),
      });
      console.log("[TaskStore] Update success, refreshing tasks...");
      await get().fetchTasks();
    } catch (e) {
      console.error("[TaskStore] Failed to update task", e);
    }
  },
}));