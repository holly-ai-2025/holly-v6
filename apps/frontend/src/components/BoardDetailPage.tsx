import React, { useEffect, useState } from "react";
import ProjectBoardView from "./ProjectBoardView";
import ListBoardView from "./ListBoardView";
import { Board } from "../api/boards";
import { getBoards } from "../api/boards";

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
    const data = await getBoards();
    const found = data.find((b) => b.board_id === boardId);
    setBoard(found || null);
  };

  const handleBoardDeleted = () => {
    onClose(); // return user back to TabBoards
  };

  if (!board) return <div>Loading...</div>;

  return board.type === "project" ? (
    <ProjectBoardView board={board} onBoardDeleted={handleBoardDeleted} />
  ) : (
    <ListBoardView board={board} onBoardDeleted={handleBoardDeleted} />
  );
};

export default BoardDetailPage;