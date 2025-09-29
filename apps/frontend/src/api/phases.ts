import api from "../lib/api";

const base = "/db/phases";

export interface Phase {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

function normalizePhase(raw: any): Phase {
  return {
    id: raw.phase_id,
    name: raw.name,
    description: raw.description,
    projectId: raw.project_id,
    order: raw.order,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function denormalizePhase(payload: Partial<Phase>): any {
  return {
    name: payload.name,
    description: payload.description,
    project_id: payload.projectId,
    order: payload.order,
    created_at: payload.createdAt,
    updated_at: payload.updatedAt,
  };
}

export async function getPhases(): Promise<Phase[]> {
  const res = await api.get(base);
  return res.data.map(normalizePhase);
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