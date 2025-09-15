import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import { getBoards, createBoard, Board } from "../api/boards";
import { createProject } from "../api/projects";
import BoardDetailPage from "../components/BoardDetailPage";

const boardColors: string[] = ["#5cc9f5", "#5a96f5", "#a469f5", "#f57ad1", "#f55c5c"];

const TabBoards: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [viewType, setViewType] = useState<"project" | "list">("project");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBoard, setNewBoard] = useState<Partial<Board>>({ type: "project" });
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const fetchBoards = async () => {
    try {
      const data = await getBoards();
      if (Array.isArray(data)) setBoards(data);
      else setBoards([]);
    } catch (err) {
      console.error("[TabBoards] Failed to fetch boards", err);
      setBoards([]);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = async () => {
    if (!newBoard.name || !newBoard.type) return;
    try {
      const createdBoard = await createBoard({
        name: newBoard.name,
        type: newBoard.type,
        category: newBoard.category,
        color: newBoard.color,
        description: newBoard.description,
      });

      if (createdBoard.type === "project") {
        await createProject({
          boardId: createdBoard.boardId,
          name: createdBoard.name,
          notes: createdBoard.description,
        });
      }

      setDialogOpen(false);
      setNewBoard({ type: "project" });
      fetchBoards();
    } catch (err) {
      console.error("[TabBoards] Failed to create board", err);
    }
  };

  const filteredBoards = boards.filter(
    (b) => b.type === viewType && (categoryFilter === "all" || b.category === categoryFilter)
  );

  const renderProjectCard = (board: Board) => {
    const completion = Math.floor(Math.random() * 100);
    const deadline = board.updatedAt || null;

    return (
      <Paper
        key={board.id}
        elevation={3}
        sx={{ p: 2, borderRadius: 3, minHeight: 180, display: "flex", flexDirection: "column", cursor: "pointer" }}
        onClick={() => setSelectedBoard(board)}
      >
        <Box sx={{ height: 6, borderRadius: 2, backgroundColor: board.color || boardColors[0], mb: 2 }} />
        <Typography variant="h6" fontWeight="bold">{board.name}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {board.description || "No description"}
        </Typography>
        <Box mt="auto">
          <Typography variant="caption" color="text.secondary">
            Deadline: {deadline ? dayjs(deadline).format("MMM D, YYYY") : "–"}
          </Typography>
          <LinearProgress variant="determinate" value={completion} sx={{ mt: 1, borderRadius: 1 }} />
          <Typography variant="caption">{completion}% complete</Typography>
        </Box>
      </Paper>
    );
  };

  const renderListCard = (board: Board) => {
    const taskCount = Math.floor(Math.random() * 10);
    const itemCount = Math.floor(Math.random() * 5);

    return (
      <Paper
        key={board.id}
        elevation={3}
        sx={{ p: 2, borderRadius: 3, minHeight: 160, display: "flex", flexDirection: "column", cursor: "pointer" }}
        onClick={() => setSelectedBoard(board)}
      >
        <Box sx={{ height: 6, borderRadius: 2, backgroundColor: board.color || boardColors[1], mb: 2 }} />
        <Typography variant="h6" fontWeight="bold">{board.name}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {board.description || "No description"}
        </Typography>
        <Box mt="auto">
          <Typography variant="caption" color="text.secondary">
            {taskCount} tasks • {itemCount} items
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Updated {board.updatedAt ? dayjs(board.updatedAt).fromNow() : "–"}
          </Typography>
        </Box>
      </Paper>
    );
  };

  if (selectedBoard) {
    return (
      <Box p={2}>
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton onClick={() => setSelectedBoard(null)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" ml={1}>{selectedBoard.name}</Typography>
        </Box>
        <BoardDetailPage board={selectedBoard} />
      </Box>
    );
  }

  return (
    <Box p={2}>
      {/* Controls always visible */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={(_, val) => val && setViewType(val)}
        >
          <ToggleButton value="project">Projects</ToggleButton>
          <ToggleButton value="list">Lists</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="home">Home</MenuItem>
            <MenuItem value="social">Social</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={() => setDialogOpen(true)}>+ New Board</Button>
      </Box>

      {/* Content area */}
      <Box>
        {filteredBoards.length > 0 ? (
          <Grid container spacing={2}>
            {filteredBoards.map((b) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={b.id}>
                {b.type === "project" ? renderProjectCard(b) : renderListCard(b)}
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" mt={6}>
            <Typography variant="h6" gutterBottom>No boards yet</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Start by creating your first {viewType} board.
            </Typography>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>Create Board</Button>
          </Box>
        )}
      </Box>

      {/* New Board Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Create New Board</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={newBoard.name || ""}
            onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={newBoard.type || "project"}
              label="Type"
              onChange={(e) => setNewBoard({ ...newBoard, type: e.target.value as "project" | "list" })}
            >
              <MenuItem value="project">Project</MenuItem>
              <MenuItem value="list">List</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={newBoard.category || "work"}
              label="Category"
              onChange={(e) => setNewBoard({ ...newBoard, category: e.target.value })}
            >
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="social">Social</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Color</InputLabel>
            <Select
              value={newBoard.color || boardColors[0]}
              label="Color"
              onChange={(e) => setNewBoard({ ...newBoard, color: e.target.value })}
            >
              {boardColors.map((c) => (
                <MenuItem key={c} value={c}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, backgroundColor: c, borderRadius: "50%" }} />
                    {c}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            value={newBoard.description || ""}
            onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateBoard}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TabBoards;