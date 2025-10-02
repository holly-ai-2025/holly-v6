import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8000" : null);

if (!baseURL) {
  console.error("[API] Missing VITE_API_URL in production build!");
}

const api = axios.create({
  baseURL,
});

// ✅ Interceptor to enforce correct headers
api.interceptors.request.use((config) => {
  if (
    config.method === "post" ||
    config.method === "patch" ||
    config.method === "put"
  ) {
    if (!config.headers) config.headers = {};
    config.headers["Content-Type"] = "application/json";
  }

  if (baseURL?.includes("ngrok")) {
    config.headers["ngrok-skip-browser-warning"] = "true";
  }

  console.log(
    "[API Request]",
    config.method?.toUpperCase(),
    config.url,
    config.headers
  );
  return config;
});

// =============================
// Boards API
// =============================
export const getBoards = (boardType?: string) =>
  api.get("/db/boards", { params: boardType ? { board_type: boardType } : {} });

export const createBoard = (data: any) => api.post("/db/boards", data);

export const updateBoard = (id: number, data: any) =>
  api.patch(`/db/boards/${id}`, data);

// =============================
// Phases API
// =============================
export const getPhases = (boardId: number) =>
  api.get(`/db/phases/${boardId}`);

export const createPhase = (data: any) => api.post("/db/phases", data);

export const updatePhase = (id: number, data: any) =>
  api.patch(`/db/phases/${id}`, data);

// =============================
// Groups API
// =============================
export const getGroups = (boardId: number) =>
  api.get(`/db/groups/${boardId}`);

export const createGroup = (data: any) => api.post("/db/groups", data);

export const updateGroup = (id: number, data: any) =>
  api.patch(`/db/groups/${id}`, data);

// =============================
// Tasks API
// =============================
export const getTasks = () => api.get("/db/tasks");

export const getTaskById = (id: number) => api.get(`/db/tasks/${id}`);

export const createTask = (data: any) => api.post("/db/tasks", data);

export const updateTask = (id: number, data: any) =>
  api.patch(`/db/tasks/${id}`, data);

export default api;