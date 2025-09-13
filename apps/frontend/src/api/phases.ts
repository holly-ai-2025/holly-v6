import client from "./client";

const base = "/db/phases";

export interface Phase {
  id: number;
  phaseId: number;
  projectId: number;
  name: string;
  deadline?: string;
  dependsOnPrevious?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function normalizePhase(raw: any): Phase {
  return {
    id: raw.phase_id,
    phaseId: raw.phase_id,
    projectId: raw.project_id,
    name: raw.name,
    deadline: raw.deadline,
    dependsOnPrevious: raw.depends_on_previous,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export async function getPhases(): Promise<Phase[]> {
  const res = await client.get(base);
  return res.data.map(normalizePhase);
}

export async function createPhase(payload: any): Promise<Phase> {
  const res = await client.post(base, payload);
  return normalizePhase(res.data);
}

export async function updatePhase(id: number, payload: any): Promise<Phase> {
  const res = await client.patch(`${base}/${id}`, payload);
  return normalizePhase(res.data);
}

export async function deletePhase(id: number): Promise<{ ok: boolean }> {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}
