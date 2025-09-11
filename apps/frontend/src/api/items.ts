import client from "./client";

const base = "/db/items";

export async function getItems() {
  const res = await client.get(base);
  return res.data;
}

export async function createItem(payload: any) {
  const res = await client.post(base, payload);
  return res.data;
}

export async function updateItem(id: number, payload: any) {
  const res = await client.patch(`${base}/${id}`, payload);
  return res.data;
}

export async function deleteItem(id: number) {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}
