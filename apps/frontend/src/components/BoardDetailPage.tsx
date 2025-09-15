import React from "react";
import { Box, Typography } from "@mui/material";
import { Board } from "../api/boards";
import ProjectBoardView from "./ProjectBoardView";
import ListBoardView from "./ListBoardView";

interface BoardDetailPageProps {
  board: Board;
}

const BoardDetailPage: React.FC<BoardDetailPageProps> = ({ board }) => {
  if (!board) {
    return (
      <Box p={2}>
        <Typography variant="body1">No board selected.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {board.type === "project" ? (
        <ProjectBoardView board={board} />
      ) : (
        <ListBoardView board={board} />
      )}
    </Box>
  );
};

export default BoardDetailPage;