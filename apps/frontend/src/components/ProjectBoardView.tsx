import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Divider,
  IconButton,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { getPhases, createPhase } from "../lib/api";
import { getTasks, createTask, updateTask } from "../lib/api";
import TaskDialog from "./TaskDialog";
import PhaseDialog from "./PhaseDialog";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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

interface ProjectBoardViewProps {
  board: Board;
  onBoardDeleted?: () => void;
}

const ProjectBoardView: React.FC<ProjectBoardViewProps> = ({ board }) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);

  const [phaseDialogOpen, setPhaseDialogOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  const [editingProject, setEditingProject] = useState(false);
  const [editedName, setEditedName] = useState(board.name);
  const [editedNotes, setEditedNotes] = useState(board.description || "");
  const [editedDeadline, setEditedDeadline] = useState<any>(null);

  useEffect(() => {
    if (board?.board_id) {
      fetchPhases();
      fetchTasks();
    }
  }, [board?.board_id]);

  const fetchPhases = async () => {
    try {
      const res = await getPhases();
      const boardPhases = res.data.filter((p: Phase) => p.board_id === board.board_id && !p.archived);
      setPhases(boardPhases);
      const expanded: Record<number, boolean> = {};
      boardPhases.forEach((p) => (expanded[p.phase_id] = true));
      setOpenGroups(expanded);
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

  const handleTogglePhase = (phaseId: number) => {
    setOpenGroups((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        {editingProject ? (
          <TextField
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            fullWidth
          />
        ) : (
          board.name
        )}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {editingProject ? (
          <TextField
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            fullWidth
            multiline
          />
        ) : (
          board.description || "No description"
        )}
      </Typography>
      <Divider sx={{ my: 2 }} />

      {phases.map((phase) => (
        <Box key={phase.phase_id} mb={2}>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => handleTogglePhase(phase.phase_id)}>
              {openGroups[phase.phase_id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <Typography variant="h6">{phase.name}</Typography>
          </Box>
          {openGroups[phase.phase_id] && (
            <Box ml={4}>
              {tasks.filter((t) => t.phase_id === phase.phase_id).map((task) => (
                <Paper key={task.task_id} sx={{ p: 1.5, mb: 1, borderRadius: 1 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{task.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{task.description || "No description"}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Due: {task.due_date ? dayjs(task.due_date).format("MMM D, YYYY") : "–"}
                      </Typography>
                    </Box>
                    <Checkbox checked={task.status === "done"} onChange={() => updateTask(task.task_id, { status: task.status === "done" ? "todo" : "done" })} />
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      ))}

      {tasks.filter((t) => !t.phase_id).length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Unassigned Tasks</Typography>
          {tasks.filter((t) => !t.phase_id).map((task) => (
            <Paper key={task.task_id} sx={{ p: 1.5, mb: 1, borderRadius: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">{task.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{task.description || "No description"}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Due: {task.due_date ? dayjs(task.due_date).format("MMM D, YYYY") : "–"}
                  </Typography>
                </Box>
                <Checkbox checked={task.status === "done"} onChange={() => updateTask(task.task_id, { status: task.status === "done" ? "todo" : "done" })} />
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Box mt={4}>
        <Button variant="outlined" onClick={() => setPhaseDialogOpen(true)}>+ Add Phase</Button>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={() => setTaskDialogOpen(true)}>+ Add Task</Button>
      </Box>

      {taskDialogOpen && (
        <TaskDialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} onTaskAdded={fetchTasks} boardId={board.board_id} />
      )}

      {phaseDialogOpen && (
        <PhaseDialog open={phaseDialogOpen} onClose={() => setPhaseDialogOpen(false)} onPhaseAdded={fetchPhases} boardId={board.board_id} />
      )}
    </Box>
  );
};

export default ProjectBoardView;