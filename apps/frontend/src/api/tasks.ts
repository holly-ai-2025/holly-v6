import client from "./client";

const base = "/db/tasks";

export interface Task {
  id: number;
  taskId: number;
  name: string;
  description?: string;
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  priority: string;
  category?: string;
  tokenValue?: number;
  urgencyScore?: number;
  effortLevel?: string;
  boardId?: number;
  groupId?: number;
  projectId?: number;
  phaseId?: number;
  archived: boolean;
  pinned: boolean;
}

function normalizeTask(raw: any): Task {
  return {
    id: raw.task_id,
    taskId: raw.task_id,
    name: raw.task_name,
    description: raw.description,
    dueDate: raw.due_date,
    startDate: raw.start_date,
    endDate: raw.end_date,
    status: raw.status,
    priority: raw.priority,
    category: raw.category,
    tokenValue: raw.token_value,
    urgencyScore: raw.urgency_score,
    effortLevel: raw.effort_level,
    boardId: raw.board_id,
    groupId: raw.group_id,
    projectId: raw.project_id,
    phaseId: raw.phase_id,
    archived: raw.archived,
    pinned: raw.pinned,
  };
}

export async function getTasks(): Promise<Task[]> {
  const res = await client.get(base);
  return res.data.map(normalizeTask);
}

export async function createTask(payload: any): Promise<Task> {
  const res = await client.post(base, payload);
  return normalizeTask(res.data);
}

export async function updateTask(id: number, payload: any): Promise<Task> {
  const res = await client.patch(`${base}/${id}`, payload);
  return normalizeTask(res.data);
}

export async function deleteTask(id: number): Promise<{ ok: boolean }> {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}
