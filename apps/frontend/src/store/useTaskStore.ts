import { create } from "zustand";
import { groupTasks } from "../utils/groupTasks";

console.log("[TaskStore] import.meta.env:", import.meta.env);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const OPS_TOKEN = import.meta.env.VITE_OPS_TOKEN || "";
console.log("[TaskStore] Using API_BASE:", API_BASE);

interface TaskStore {
  tasks: any[];
  groupedTasks: Record<string, any[]>;
  fetchTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  groupedTasks: {},
  fetchTasks: async () => {
    const url = `${API_BASE}/db/query`;
    console.log("[TaskStore] Fetching tasks from:", url);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPS_TOKEN}`,
        },
        body: JSON.stringify({ sql: "SELECT * FROM tasks", params: [] }),
      });
      const data = await res.json();
      console.log("[TaskStore] Response:", data);
      if (data.ok) {
        const rows = data.rows.map((row: any, i: number) => {
          const mapped: any = {};
          data.columns.forEach((col: string, j: number) => {
            mapped[col] = row[j];
          });
          return mapped;
        });
        set({ tasks: rows, groupedTasks: groupTasks(rows) });
      } else {
        console.error("[TaskStore] Query error:", data.error);
      }
    } catch (err) {
      console.error("[TaskStore] Failed to fetch tasks", err);
    }
  },
}));