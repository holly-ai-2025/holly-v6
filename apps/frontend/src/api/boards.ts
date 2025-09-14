import client from "./client";

const base = "/db/boards";

export interface Board {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

function normalizeBoard(raw: any): Board {
  return {
    id: raw.board_id,
    name: raw.name,
    description: raw.description,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function denormalizeBoard(payload: Partial<Board>): any {
  return {
    name: payload.name,
    description: payload.description,
    created_at: payload.createdAt,
    updated_at: payload.updatedAt,
  };
}

export async function getBoards(): Promise<Board[]> {
  const res = await client.get(base);
  return res.data.map(normalizeBoard);
}

export async function createBoard(payload: Partial<Board>): Promise<Board> {
  const res = await client.post(base, denormalizeBoard(payload));
  return normalizeBoard(res.data);
}

export async function updateBoard(id: number, payload: Partial<Board>): Promise<Board> {
  const res = await client.patch(`${base}/${id}`, denormalizeBoard(payload));
  return normalizeBoard(res.data);
}

export async function deleteBoard(id: number): Promise<{ ok: boolean }> {
  const res = await client.delete(`${base}/${id}`);
  return res.data;
}