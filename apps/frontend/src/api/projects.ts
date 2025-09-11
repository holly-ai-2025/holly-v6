import client from "./client";

const base = "/db/projects";

export async function getProjects() {
  const res = await client.get(base);
  return res.data;
}

export async function createProject(payload: any) {
  const res = await client.post(base, payload);
  return res.data;
}

export async function updateProject(id: number, payload: any) {
  const res = await client.patch(`${base}/${id}`, payload);
  return res.data;
}

export async function deleteProject(id: number) {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}
