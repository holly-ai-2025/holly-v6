import api from "../lib/api";

export interface Task {
  id?: number;
  name: string;
  description?: string;
  boardId?: number;
  phaseId?: number;
  groupId?: number;
  status?: string;
  priority?: string;
  category?: string;
  tokenValue?: number;
  dueDate?: string;
  effortLevel?: string;
  archived?: boolean;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

function stripUndefined(obj: Record<string, any>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
}

function normalizeTask(data: any): Task {
  return {
    id: data.task_id,
    name: data.title,
    description: data.description,
    boardId: data.board_id,
    phaseId: data.phase_id,
    groupId: data.group_id,
    status: data.status,
    priority: data.priority,
    category: data.category,
    tokenValue: data.token_value,
    dueDate: data.due_date,
    effortLevel: data.effort_level,
    archived: data.archived,
    pinned: data.pinned,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    notes: data.notes,
  };
}

function denormalizeTask(payload: Partial<Task>): any {
  const raw: any = {
    title: payload.name,
    description: payload.description,
    board_id: payload.boardId,
    phase_id: payload.phaseId,
    group_id: payload.groupId,
    status: payload.status,
    priority: payload.priority,
    category: payload.category,
    token_value: payload.tokenValue,
    due_date: payload.dueDate,
    effort_level: payload.effortLevel,
    archived: payload.archived,
    pinned: payload.pinned,
    created_at: payload.createdAt,
    updated_at: payload.updatedAt,
    notes: payload.notes,
  };

  return stripUndefined(raw);
}

export async function getTasks(boardId?: number): Promise<Task[]> {
  const query = boardId ? `?board_id=${boardId}` : "";
  const res = await api.get(`/db/tasks${query}`);
  return res.data.map(normalizeTask);
}

export async function getTask(id: number): Promise<Task> {
  const res = await api.get(`/db/tasks/${id}`);
  return normalizeTask(res.data);
}

export async function createTask(payload: Partial<Task>): Promise<Task> {
  const res = await api.post("/db/tasks", denormalizeTask(payload));
  return normalizeTask(res.data);
}

export async function updateTask(id: number, payload: Partial<Task>): Promise<Task> {
  const res = await api.patch(`/db/tasks/${id}`, denormalizeTask(payload));
  return normalizeTask(res.data);
}

export async function deleteTask(id: number): Promise<void> {
  await api.patch(`/db/tasks/${id}`, { archived: true });
}