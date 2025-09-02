const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/db/tasks`, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_URL}/db/projects`, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function fetchHabits() {
  const res = await fetch(`${API_URL}/db/habits`, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
  });
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
}

