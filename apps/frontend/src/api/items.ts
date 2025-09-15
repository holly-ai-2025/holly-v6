import client from "./client";

const base = "/db/items";

export interface Item {
  id: number;
  name: string;
  description?: string;
  boardId?: number;
  projectId?: number;
  phaseId?: number;
  groupId?: number;
  status?: string;
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

function normalizeItem(raw: any): Item {
  return {
    id: raw.item_id,
    name: raw.name,
    description: raw.description,
    boardId: raw.board_id,
    projectId: raw.project_id,
    phaseId: raw.phase_id,
    groupId: raw.group_id,
    status: raw.status,
    dueDate: raw.due_date,
    startDate: raw.start_date,
    endDate: raw.end_date,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function denormalizeItem(payload: Partial<Item>): any {
  return {
    name: payload.name,
    description: payload.description,
    board_id: payload.boardId,
    project_id: payload.projectId,
    phase_id: payload.phaseId,
    group_id: payload.groupId,
    status: payload.status,
    due_date: payload.dueDate,
    start_date: payload.startDate,
    end_date: payload.endDate,
    created_at: payload.createdAt,
    updated_at: payload.updatedAt,
  };
}

export async function getItems(): Promise<Item[]> {
  const res = await client.get(base);
  return res.data.map(normalizeItem);
}

export async function createItem(payload: Partial<Item>): Promise<Item> {
  const res = await client.post(base, denormalizeItem(payload));
  return normalizeItem(res.data);
}

export async function updateItem(id: number, payload: Partial<Item>): Promise<Item> {
  const res = await client.patch(`${base}/${id}`, denormalizeItem(payload));
  return normalizeItem(res.data);
}

export async function deleteItem(id: number): Promise<{ ok: boolean }> {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}