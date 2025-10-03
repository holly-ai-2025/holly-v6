import api from "../lib/api";

const base = "/db/phases";

export interface Phase {
  id: number;
  name: string;
  boardId: number;
  createdAt?: string;
  updatedAt?: string;
}

function normalizePhase(raw: any): Phase {
  return {
    id: raw.phase_id,
    name: raw.name,
    boardId: raw.board_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function denormalizePhase(payload: Partial<Phase>): any {
  return {
    name: payload.name,
    board_id: payload.boardId,
  };
}

export async function getPhases(boardId?: number): Promise<Phase[]> {
  if (boardId) {
    const res = await api.get(`${base}?board_id=${boardId}`);
    return res.data.map(normalizePhase);
  } else {
    const res = await api.get(base);
    return res.data.map(normalizePhase);
  }
}

export async function createPhase(payload: Partial<Phase>): Promise<Phase> {
  const res = await api.post(base, denormalizePhase(payload));
  return normalizePhase(res.data);
}

export async function updatePhase(id: number, payload: Partial<Phase>): Promise<Phase> {
  const res = await api.patch(`${base}/${id}`, denormalizePhase(payload));
  return normalizePhase(res.data);
}

export async function deletePhase(id: number): Promise<{ ok: boolean }> {
  const res = await api.delete(`${base}/${id}`);
  return res.data;
}