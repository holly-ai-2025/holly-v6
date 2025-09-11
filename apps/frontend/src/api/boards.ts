import client from "./client";

const base = "/db/boards";

export async function getBoards() {
  const res = await client.get(base);
  return res.data;
}

export async function createBoard(payload: any) {
  const res = await client.post(base, payload);
  return res.data;
}

export async function updateBoard(id: number, payload: any) {
  const res = await client.patch(`${base}/${id}`, payload);
  return res.data;
}

export async function deleteBoard(id: number) {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}
