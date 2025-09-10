import axios from "axios";

const API_URL = "http://localhost:8000/db/tasks";

export async function getTasks() {
  const res = await axios.get(API_URL);
  console.log("[API] GET /tasks response", res.data);
  return res.data;
}

export async function createTask(payload: any) {
  console.log("[API] POST /tasks payload", payload);
  const res = await axios.post(API_URL, payload);
  console.log("[API] POST /tasks response", res.data);
  return res.data;
}

export async function updateTask(id: string, payload: any) {
  console.log(`(API) PATCH /tasks/${id} payload`, payload);
  const res = await axios.patch(`${API_URL}/${id}`, payload);
  console.log("[API] PATCH response", res.data);
  return res.data;
}