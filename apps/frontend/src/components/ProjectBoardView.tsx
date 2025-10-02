import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Divider,
  IconButton,
  Button,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { getPhases, updatePhase, Phase } from "../api/phases";
import { getTasks, createTask, updateTask, Task } from "../api/tasks";
import { updateBoard, Board } from "../api/boards";
import TaskDialog from "./TaskDialog";
import PhaseDialog from "./PhaseDialog";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface ProjectBoardViewProps {
  board: Board;
  onBoardDeleted?: () => void;
}

const ProjectBoardView: React.FC<ProjectBoardViewProps> = ({ board, onBoardDeleted }) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);

  const [phaseDialogOpen, setPhaseDialogOpen] = useState(false);

  const [editingBoard, setEditingBoard] = useState(false);
  const [editedName, setEditedName] = useState(board.name);
  const [editedNotes, setEditedNotes] = useState(board.description || "");
  const [editedDeadline, setEditedDeadline] = useState<any>(board.deadline ? dayjs(board.deadline) : null);

  useEffect(() => {
    fetchPhases(board.id);
    fetchTasks(board.id);
  }, [board.id]);

  const fetchPhases = async (boardId: number) => {
    try {
      const data = await getPhases();
      const boardPhases = data.filter((p: Phase) => p.boardId === boardId && !p.archived);
      setPhases(boardPhases);
      const expanded: Record<number, boolean> = {};
      boardPhases.forEach((p) => (expanded[p.id] = true));
      setOpenGroups(expanded);
    } catch (err) {
      console.error("[ProjectBoardView] Failed to fetch phases", err);
    }
  };

  const fetchTasks = async (boardId: number) => {
    try {
      const data = await getTasks();
      setTasks(data.filter((t: Task) => t.boardId === boardId && !t.archived));
    } catch (err) {
      console.error("[ProjectBoardView] Failed to fetch tasks", err);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    try {
      const newStatus = task.status === "Done" ? "Todo" : "Done";
      await updateTask(task.id, { status: newStatus });
      fetchTasks(board.id);
    } catch (err) {
      console.error("[ProjectBoardView] Failed to update task", err);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleAddTaskClick = (phaseId: number) => {
    setSelectedTask({
      boardId: board.id,
      phaseId,
      status: "Todo",
    });
    setDialogOpen(true);
  };

  const handleDialogSave = async (form: Partial<Task>) => {
    try {
      if (form.id) {
        await updateTask(form.id, form);
      } else {
        await createTask({ ...form, boardId: board.id });
      }
      fetchTasks(board.id);
    } catch (err) {
      console.error("[ProjectBoardView] Failed to save task", err);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
  };

  const handleBoardSave = async () => {
    try {
      await updateBoard(board.id, {
        name: editedName,
        description: editedNotes,
        deadline: editedDeadline ? editedDeadline.toISOString() : null,
      });
      setEditingBoard(false);
    } catch (err) {
      console.error("[ProjectBoardView] Failed to update board", err);
    }
  };

  const handleDeletePhase = async (phaseId: number) => {
    try {
      await updatePhase(phaseId, { archived: true });
      fetchPhases(board.id);
    } catch (err) {
      console.error("[ProjectBoardView] Failed to archive phase", err);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      await updateBoard(board.id, { archived: true });
      if (onBoardDeleted) onBoardDeleted();
    } catch (err) {
      console.error("[ProjectBoardView] Failed to archive board", err);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
      {/* Header */}
      {editingBoard ? (
        <Box mb={2}>
          <input
            style={{
              width: "100%",
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              padding: "0.25rem 0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <textarea
            style={{
              width: "100%",
              fontSize: "0.9rem",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "0.5rem",
            }}
            value={editedNotes}
            rows={3}
            onChange={(e) => setEditedNotes(e.target.value)}
          />

          <Box mt={2}>
            <DatePicker
              label="Deadline"
              value={editedDeadline}
              onChange={(date) => setEditedDeadline(date)}
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
            />
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
            <Button onClick={() => setEditingBoard(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleBoardSave}>Save</Button>
          </Box>
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>{board.name}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {board.description}
            </Typography>
            {board.deadline && (
              <Typography
                variant="body2"
                sx={{
                  color: dayjs(board.deadline).isBefore(dayjs()) ? "error.main" : "text.secondary",
                  fontWeight: 500,
                }}
              >
                Deadline: {dayjs(board.deadline).format("MMM D, YYYY")}
              </Typography>
            )}
          </Box>
          <IconButton onClick={() => setEditingBoard(true)}>
            <EditIcon />
          </IconButton>
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Phases */}
      {phases.map((phase) => (
        <Box key={phase.id} mt={4} ml={2} mr={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => setOpenGroups({ ...openGroups, [phase.id]: !openGroups[phase.id] })}
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {phase.name}
              {phase.deadline && (
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    ml: 1,
                    color: dayjs(phase.deadline).isBefore(dayjs()) ? "error.main" : "text.secondary",
                  }}
                >
                  ({dayjs(phase.deadline).format("MMM D, YYYY")})
                </Typography>
              )}
            </Typography>
            <Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhaseDialogOpen(true);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePhase(phase.id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                {openGroups[phase.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ mt: 1, mb: 2, borderColor: "grey.400" }} />

          {openGroups[phase.id] && (
            <Box>
              {tasks.filter((t) => t.phaseId === phase.id).map((task) => (
                <Box
                  key={task.id}
                  display="flex"
                  alignItems="center"
                  gap={0.8}
                  sx={{
                    mb: 1,
                    cursor: "pointer",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "14px",
                    boxShadow: 1,
                    py: 0.6,
                    px: 1.2,
                  }}
                  onClick={() => handleTaskClick(task)}
                >
                  <Checkbox
                    size="small"
                    sx={{ borderRadius: "50%" }}
                    checked={task.status === "Done"}
                    onClick={(e) => e.stopPropagation()}
                    onChange={async (e) => {
                      e.stopPropagation();
                      await toggleTaskStatus(task);
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textDecoration: task.status === "Done" ? "line-through" : "none",
                    }}
                  >
                    {task.name}
                  </Typography>
                  {task.startDate && task.endDate && (
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {dayjs(task.startDate).format("HH:mm")} – {dayjs(task.endDate).format("HH:mm")}
                    </Typography>
                  )}
                </Box>
              ))}

              <Box display="flex" justifyContent="flex-start" mt={1}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ borderRadius: "8px" }}
                  onClick={() => handleAddTaskClick(phase.id)}
                >
                  + Add Task
                </Button>
              </Box>

              <Divider sx={{ my: 3, borderColor: "grey.300" }} />
            </Box>
          )}
        </Box>
      ))}

      {/* Add Phase Button */}
      <Box display="flex" justifyContent="flex-start" mt={3} ml={2}>
        <Button
          variant="contained"
          sx={{ borderRadius: "14px", py: 1.2, width: "25%" }}
          onClick={() => setPhaseDialogOpen(true)}
        >
          + Add Phase
        </Button>
      </Box>

      {/* Delete Board Button */}
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button variant="outlined" color="error" onClick={handleDeleteBoard}>
          Delete Board
        </Button>
      </Box>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        task={selectedTask as Task | null}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
      />

      {/* Phase Dialog */}
      <PhaseDialog
        open={phaseDialogOpen}
        onClose={() => setPhaseDialogOpen(false)}
        boardId={board.id}
        onPhaseAdded={() => fetchPhases(board.id)}
      />
    </Paper>
  );
};

export default ProjectBoardView;