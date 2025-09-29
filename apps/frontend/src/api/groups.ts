import api from "../lib/api";

const base = "/db/groups";

export interface Group {
  id: number;
  name: string;
  description?: string;
  boardId: number;
  createdAt?: string;
  updatedAt?: string;
}

function normalizeGroup(raw: any): Group {
  return {
    id: raw.group_id,
    name: raw.name,
    description: raw.description,
    boardId: raw.board_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function denormalizeGroup(payload: Partial<Group>): any {
  return {
    name: payload.name,
    description: payload.description,
    board_id: payload.boardId,
    created_at: payload.createdAt,
    updated_at: payload.updatedAt,
  };
}

export async function getGroups(): Promise<Group[]> {
  const res = await api.get(base);
  return res.data.map(normalizeGroup);
}

export async function createGroup(payload: Partial<Group>): Promise<Group> {
  const res = await api.post(base, denormalizeGroup(payload));
  return normalizeGroup(res.data);
}

export async function updateGroup(id: number, payload: Partial<Group>): Promise<Group> {
  const res = await api.patch(`${base}/${id}`, denormalizeGroup(payload));
  return normalizeGroup(res.data);
}

export async function deleteGroup(id: number): Promise<{ ok: boolean }> {
  const res = await api.delete(`${base}/${id}`);
  return res.data;
}