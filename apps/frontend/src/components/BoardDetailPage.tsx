import React from "react";
import ProjectBoardView from "./ProjectBoardView";
import ListBoardView from "./ListBoardView";

interface Board {
  board_id: number;
  name: string;
  type: "project" | "list";
  description?: string;
  category?: string;
  color?: string;
  archived?: boolean;
}

interface BoardDetailPageProps {
  board: Board;
  onClose?: () => void;
}

const BoardDetailPage: React.FC<BoardDetailPageProps> = ({ board, onClose }) => {
  const handleBoardDeleted = () => {
    if (onClose) onClose();
  };

  return board.type === "project" ? (
    <ProjectBoardView board={board} onBoardDeleted={handleBoardDeleted} />
  ) : (
    <ListBoardView board={board} onBoardDeleted={handleBoardDeleted} />
  );
};

export default BoardDetailPage;