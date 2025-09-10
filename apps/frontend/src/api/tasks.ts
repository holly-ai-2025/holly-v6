import { normalizeTaskForApi } from "../utils/taskUtils";

const API_URL = "http://localhost:8000/db/tasks";

export async function fetchTasks() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function updateTask(id: string, updates: any) {
  const normalized = normalizeTaskForApi(updates);
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalized),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function createTask(task: any) {
  const normalized = normalizeTaskForApi(task);
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalized),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}