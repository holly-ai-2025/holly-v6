// Utility functions for fetching from backend API

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/db/tasks`, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
  });
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_URL}/db/projects`, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
  });
  return res.json();
}

export async function fetchHabits() {
  const res = await fetch(`${API_URL}/db/habits`, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
  });
  return res.json();
}