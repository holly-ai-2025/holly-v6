import client from "./client";

const base = "/db/projects";

export interface Project {
  id: number;
  projectId: number;
  name: string;
  notes?: string;
  goal?: string;
  boardId: number;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

function normalizeProject(raw: any): Project {
  return {
    id: raw.project_id,
    projectId: raw.project_id,
    name: raw.name,
    notes: raw.notes,
    goal: raw.goal,
    boardId: raw.board_id,
    deadline: raw.deadline,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function denormalizeProject(payload: any): any {
  return {
    name: payload.name,
    notes: payload.notes,
    goal: payload.goal,
    board_id: payload.boardId,
    deadline: payload.deadline,
    created_at: payload.createdAt,
    updated_at: payload.updatedAt,
  };
}

export async function getProjects(): Promise<Project[]> {
  const res = await client.get(base);
  return res.data.map(normalizeProject);
}

export async function createProject(payload: any): Promise<Project> {
  const res = await client.post(base, denormalizeProject(payload));
  return normalizeProject(res.data);
}

export async function updateProject(id: number, payload: any): Promise<Project> {
  const res = await client.patch(`${base}/${id}`, denormalizeProject(payload));
  return normalizeProject(res.data);
}

export async function deleteProject(id: number): Promise<{ ok: boolean }> {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}