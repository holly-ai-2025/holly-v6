import api from "../lib/api";

export interface Task {
  id?: number;
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
  project?: any;
  phase?: any;
  board?: any;
  notes?: string; // ✅ added
}

function stripUndefined(obj: Record<string, any>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
}

function normalizeTask(data: any): Task {
  return {
    id: data.task_id,
    name: data.task_name,
    description: data.description,
    boardId: data.board_id,
    projectId: data.project_id,
    phaseId: data.phase_id,
    groupId: data.group_id,
    status: data.status,
    urgencyScore: data.urgency_score,
    priority: data.priority,
    category: data.category,
    tokenValue: data.token_value,
    dueDate: data.due_date,
    startDate: data.start_date,
    endDate: data.end_date,
    effortLevel: data.effort_level,
    archived: data.archived,
    pinned: data.pinned,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    project: data.project,
    phase: data.phase,
    board: data.board,
    notes: data.notes, // ✅ added
  };
}

function denormalizeTask(payload: Partial<Task>): any {
  const raw: any = {
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
    notes: payload.notes, // ✅ added
  };

  return stripUndefined(raw);
}

export async function getTasks(): Promise<Task[]> {
  const res = await api.get("/db/tasks");
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