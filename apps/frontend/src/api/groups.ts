import client from "./client";

const base = "/db/groups";

export async function getGroups() {
  const res = await client.get(base);
  return res.data;
}

export async function createGroup(payload: any) {
  const res = await client.post(base, payload);
  return res.data;
}

export async function updateGroup(id: number, payload: any) {
  const res = await client.patch(`${base}/${id}`, payload);
  return res.data;
}

export async function deleteGroup(id: number) {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}
