import api from "../lib/api";

const base = "/db/boards";

export interface Board {
  id: number;
  name: string;
  type: "project" | "list";
  category?: string | null;
  color?: string | null;
  description?: string | null;
  goal?: string | null;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Convert backend snake_case → frontend camelCase
function normalizeBoard(raw: any): Board {
  return {
    id: raw.board_id,
    name: raw.name,
    type: raw.type,
    category: raw.category,
    color: raw.color,
    description: raw.description,
    goal: raw.goal,
    pinned: raw.pinned,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// Convert frontend camelCase → backend snake_case
function denormalizeBoard(payload: any): any {
  return {
    board_id: payload.id,
    name: payload.name,
    type: payload.type,
    category: payload.category,
    color: payload.color,
    description: payload.description,
    goal: payload.goal,
    pinned: payload.pinned,
    created_at: payload.createdAt,
    updated_at: payload.updatedAt,
  };
}

export async function getBoards(): Promise<Board[]> {
  const res = await api.get(base);
  return res.data.map(normalizeBoard);
}

export async function createBoard(payload: any): Promise<Board> {
  const res = await api.post(base, denormalizeBoard(payload));
  return normalizeBoard(res.data);
}

export async function updateBoard(id: number, payload: any): Promise<Board> {
  const res = await api.patch(`${base}/${id}`, denormalizeBoard(payload));
  return normalizeBoard(res.data);
}

export async function deleteBoard(id: number): Promise<{ ok: boolean }> {
  const res = await api.delete(`${base}/${id}`);
  return res.data;
}