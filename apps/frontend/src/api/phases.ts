import client from "./client";

const base = "/db/phases";

export interface Phase {
  id: number;
  phaseId: number;
  name: string;
  projectId: number;
  deadline?: string;
  dependsOnPrevious?: boolean;
  createdAt?: string;
}

function normalizePhase(raw: any): Phase {
  return {
    id: raw.phase_id,
    phaseId: raw.phase_id,
    name: raw.name,
    projectId: raw.project_id,
    deadline: raw.deadline,
    dependsOnPrevious: raw.depends_on_previous,
    createdAt: raw.created_at,
  };
}

function denormalizePhase(payload: any): any {
  return {
    name: payload.name,
    project_id: payload.projectId,
    deadline: payload.deadline,
    depends_on_previous: payload.dependsOnPrevious,
    created_at: payload.createdAt,
  };
}

export async function getPhases(): Promise<Phase[]> {
  const res = await client.get(base);
  return res.data.map(normalizePhase);
}

export async function createPhase(payload: any): Promise<Phase> {
  const res = await client.post(base, denormalizePhase(payload));
  return normalizePhase(res.data);
}

export async function updatePhase(id: number, payload: any): Promise<Phase> {
  const res = await client.patch(`${base}/${id}`, denormalizePhase(payload));
  return normalizePhase(res.data);
}

export async function deletePhase(id: number): Promise<{ ok: boolean }> {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}