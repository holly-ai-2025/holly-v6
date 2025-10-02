import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, LinearProgress } from "@mui/material";
import { getPhases, getTasks } from "../lib/api";
import dayjs from "dayjs";

interface Phase {
  phase_id: number;
  board_id: number;
  name: string;
  archived?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Task {
  task_id: number;
  board_id?: number;
  phase_id?: number;
  title: string;
  description?: string;
  due_date?: string;
  status?: string;
  priority?: string;
  category?: string;
  archived?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Board {
  board_id: number;
  name: string;
  board_type: string;
  description?: string;
  color?: string;
  category?: string;
  archived?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  board: Board;
}

const ProjectBoardView: React.FC<Props> = ({ board }) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhases = async () => {
    try {
      const res = await getPhases();
      const boardPhases = res.data.filter((p: Phase) => p.board_id === board.board_id && !p.archived);
      setPhases(boardPhases);
    } catch (err) {
      console.error("[ProjectBoardView] Failed to fetch phases", err);
      setPhases([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      const boardTasks = res.data.filter((t: Task) => t.board_id === board.board_id && !t.archived);
      setTasks(boardTasks);
    } catch (err) {
      console.error("[ProjectBoardView] Failed to fetch tasks", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    if (board?.board_id) {
      Promise.all([fetchPhases(), fetchTasks()]).then(() => setLoading(false));
    }
  }, [board?.board_id]);

  if (loading) {
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>{board.name}</Typography>
      <Typography variant="body2" gutterBottom>{board.description || "No description"}</Typography>

      <Grid container spacing={2}>
        {phases.map((phase) => (
          <Grid item xs={12} md={6} key={phase.phase_id}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>{phase.name}</Typography>
              {tasks.filter((t) => t.phase_id === phase.phase_id).map((task) => (
                <Paper key={task.task_id} sx={{ p: 1.5, mb: 1, borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">{task.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{task.description || "No description"}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Due: {task.due_date ? dayjs(task.due_date).format("MMM D, YYYY") : "–"}
                  </Typography>
                </Paper>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {tasks.filter((t) => !t.phase_id).length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Unassigned Tasks</Typography>
          {tasks.filter((t) => !t.phase_id).map((task) => (
            <Paper key={task.task_id} sx={{ p: 1.5, mb: 1, borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">{task.title}</Typography>
              <Typography variant="body2" color="text.secondary">{task.description || "No description"}</Typography>
              <Typography variant="caption" color="text.secondary">
                Due: {task.due_date ? dayjs(task.due_date).format("MMM D, YYYY") : "–"}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProjectBoardView;