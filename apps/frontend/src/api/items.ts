import client from "./client";

const base = "/db/items";

export interface Item {
  id: number;
  itemId: number;
  title: string;
  content?: string;
  category?: string;
  pinned: boolean;
  boardId: number;
  groupId?: number;
  createdAt?: string;
  updatedAt?: string;
}

function normalizeItem(raw: any): Item {
  return {
    id: raw.item_id,
    itemId: raw.item_id,
    title: raw.title,
    content: raw.content,
    category: raw.category,
    pinned: raw.pinned,
    boardId: raw.board_id,
    groupId: raw.group_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export async function getItems(): Promise<Item[]> {
  const res = await client.get(base);
  return res.data.map(normalizeItem);
}

export async function createItem(payload: any): Promise<Item> {
  const res = await client.post(base, payload);
  return normalizeItem(res.data);
}

export async function updateItem(id: number, payload: any): Promise<Item> {
  const res = await client.patch(`${base}/${id}`, payload);
  return normalizeItem(res.data);
}

export async function deleteItem(id: number): Promise<{ ok: boolean }> {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}
