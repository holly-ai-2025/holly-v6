import React, { useEffect, useState } from "react";
import ProjectBoardView from "./ProjectBoardView";
import ListBoardView from "./ListBoardView";
import { getBoards } from "../lib/api";

interface Board {
  board_id: number;
  name: string;
  board_type: "project" | "list";
  description?: string;
  category?: string;
  color?: string;
  archived?: boolean;
}

interface BoardDetailPageProps {
  boardId: number;
  onClose: () => void;
}

const BoardDetailPage: React.FC<BoardDetailPageProps> = ({ boardId, onClose }) => {
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  const fetchBoard = async () => {
    try {
      const res = await getBoards();
      const found = res.data.find((b: Board) => b.board_id === boardId);
      setBoard(found || null);
    } catch (err) {
      console.error("[BoardDetailPage] Failed to fetch board", err);
      setBoard(null);
    }
  };

  const handleBoardDeleted = () => {
    onClose(); // return user back to TabBoards
  };

  if (!board) return <div>Loading...</div>;

  return board.board_type === "project" ? (
    <ProjectBoardView board={board} onBoardDeleted={handleBoardDeleted} />
  ) : (
    <ListBoardView board={board} onBoardDeleted={handleBoardDeleted} />
  );
};

export default BoardDetailPage;