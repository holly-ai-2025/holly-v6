import client from "./client";

const base = "/db/groups";

export interface Group {
  id: number;
  groupId: number;
  boardId: number;
  name: string;
  sortOrder: number;
}

function normalizeGroup(raw: any): Group {
  return {
    id: raw.group_id,
    groupId: raw.group_id,
    boardId: raw.board_id,
    name: raw.name,
    sortOrder: raw.sort_order,
  };
}

export async function getGroups(): Promise<Group[]> {
  const res = await client.get(base);
  return res.data.map(normalizeGroup);
}

export async function createGroup(payload: any): Promise<Group> {
  const res = await client.post(base, payload);
  return normalizeGroup(res.data);
}

export async function updateGroup(id: number, payload: any): Promise<Group> {
  const res = await client.patch(`${base}/${id}`, payload);
  return normalizeGroup(res.data);
}

export async function deleteGroup(id: number): Promise<{ ok: boolean }> {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}
