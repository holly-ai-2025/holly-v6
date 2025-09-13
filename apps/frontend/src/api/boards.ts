import client from "./client";

const base = "/db/boards";

export interface Board {
  id: number;
  boardId: number;
  name: string;
  type: string;
  category?: string;
  color?: string;
  description?: string;
  pinned: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function normalizeBoard(raw: any): Board {
  return {
    id: raw.board_id,
    boardId: raw.board_id,
    name: raw.name,
    type: raw.type,
    category: raw.category,
    color: raw.color,
    description: raw.description,
    pinned: raw.pinned,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export async function getBoards(): Promise<Board[]> {
  const res = await client.get(base);
  return res.data.map(normalizeBoard);
}

export async function createBoard(payload: any): Promise<Board> {
  const res = await client.post(base, payload);
  return normalizeBoard(res.data);
}

export async function updateBoard(id: number, payload: any): Promise<Board> {
  const res = await client.patch(`${base}/${id}`, payload);
  return normalizeBoard(res.data);
}

export async function deleteBoard(id: number): Promise<{ ok: boolean }> {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}
