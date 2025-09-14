import client from "./client";

const base = "/db/tasks";

export interface Task {
  id: number;
  name: string;
  description?: string;
  boardId?: number;
  projectId?: number;
  phaseId?: number;
  groupId?: number;
  status?: string;
  urgencyScore?: number;
  priority?: string;
  category?: string;
  tokenValue?: number;
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  effortLevel?: string;
  archived?: boolean;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function normalizeTask(raw: any): Task {
  return {
    id: raw.task_id,
    name: raw.task_name,
    description: raw.description,
    boardId: raw.board_id,
    projectId: raw.project_id,
    phaseId: raw.phase_id,
    groupId: raw.group_id,
    status: raw.status,
    urgencyScore: raw.urgency_score,
    priority: raw.priority,
    category: raw.category,
    tokenValue: raw.token_value,
    dueDate: raw.due_date,
    startDate: raw.start_date,
    endDate: raw.end_date,
    effortLevel: raw.effort_level,
    archived: raw.archived,
    pinned: raw.pinned,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function denormalizeTask(payload: Partial<Task>): any {
  return {
    task_name: payload.name,
    description: payload.description,
    board_id: payload.boardId,
    project_id: payload.projectId,
    phase_id: payload.phaseId,
    group_id: payload.groupId,
    status: payload.status,
    urgency_score: payload.urgencyScore,
    priority: payload.priority,
    category: payload.category,
    token_value: payload.tokenValue,
    due_date: payload.dueDate,
    start_date: payload.startDate,
    end_date: payload.endDate,
    effort_level: payload.effortLevel,
    archived: payload.archived,
    pinned: payload.pinned,
    created_at: payload.createdAt,
    updated_at: payload.updatedAt,
  };
}

export async function getTasks(): Promise<Task[]> {
  const res = await client.get(base);
  return res.data.map(normalizeTask);
}

export async function createTask(payload: Partial<Task>): Promise<Task> {
  const res = await client.post(base, denormalizeTask(payload));
  return normalizeTask(res.data);
}

export async function updateTask(id: number, payload: Partial<Task>): Promise<Task> {
  const res = await client.patch(`${base}/${id}`, denormalizeTask(payload));
  return normalizeTask(res.data);
}

export async function deleteTask(id: number): Promise<{ ok: boolean }> {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}