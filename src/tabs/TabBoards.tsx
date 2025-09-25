import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { getBoards, createBoard } from '../api/client';
import BoardDetailPage from '../components/BoardDetailPage';
import TaskDialog from '../components/TaskDialog'; // ✅ fixed casing

const TabBoards = () => {
  const [boards, setBoards] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    const boards = await getBoards();
    setBoards(boards);
  };

  const handleCreateBoard = async () => {
    const newBoard = await createBoard({ name: 'New Board', type: 'project' });
    if (newBoard) loadBoards();
  };

  return (
    <Box>
      <Typography variant="h4">Boards</Typography>
      <Button onClick={handleCreateBoard}>Create Board</Button>
      <Grid container spacing={2}>
        {boards.map((board) => (
          <Grid item xs={12} md={6} key={board.board_id}>
            <BoardDetailPage board={board} />
          </Grid>
        ))}
      </Grid>
      <TaskDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
};

export default TabBoards;