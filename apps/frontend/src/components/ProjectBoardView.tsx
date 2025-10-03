import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import { getPhases, createPhase, Phase } from "../api/phases";
import { getTasks, createTask, updateTask, Task } from "../api/tasks";
import { updateBoard, Board } from "../api/boards";
import TaskDialog from "./TaskDialog";
import PhaseDialog from "./PhaseDialog";

interface ProjectBoardViewProps {
  board: Board;
  onBoardDeleted?: () => void;
}

const ProjectBoardView: React.FC<ProjectBoardViewProps> = ({ board, onBoardDeleted }) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({});

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  const [phaseDialogOpen, setPhaseDialogOpen] = useState(false);

  useEffect(() => {
    if (board) {
      fetchPhases();
      fetchTasks();
    }
  }, [board]);

  const fetchPhases = async () => {
    try {
      const data = await getPhases(board.id);
      setPhases(data);
    } catch (err) {
      console.error("[ProjectBoardView] Failed to fetch phases", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks(board.id);
      setTasks(data);
    } catch (err) {
      console.error("[ProjectBoardView] Failed to fetch tasks", err);
    }
  };

  const handleAddPhase = async (name: string) => {
    try {
      await createPhase({ name, boardId: board.id });
      fetchPhases();
    } catch (err) {
      console.error("[ProjectBoardView] Failed to create phase", err);
    }
  };

  const handleAddTask = async (phase: Phase) => {
    setSelectedTask(null);
    setSelectedPhase(phase);
    setTaskDialogOpen(true);
  };

  const handleSaveTask = async (payload: Partial<Task>) => {
    try {
      if (selectedTask && selectedTask.id) {
        const updated = await updateTask(selectedTask.id, payload);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const optimisticTask: Task = {
          ...payload,
          id: Math.random(), // temporary ID
          name: payload.name || "Untitled Task",
          boardId: board.id,
          phaseId: selectedPhase?.id,
          archived: false,
        } as Task;
        setTasks((prev) => [...prev, optimisticTask]);

        const created = await createTask({ ...payload, boardId: board.id, phaseId: selectedPhase?.id });
        setTasks((prev) => prev.map((t) => (t.id === optimisticTask.id ? created : t)));
      }
      fetchTasks();
    } catch (err) {
      console.error("[ProjectBoardView] Failed to save task", err);
    }
  };

  const handleArchiveBoard = async () => {
    try {
      await updateBoard(board.id, { archived: true });
      if (onBoardDeleted) onBoardDeleted();
    } catch (err) {
      console.error("[ProjectBoardView] Failed to archive board", err);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">{board.name}</Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={() => setPhaseDialogOpen(true)}>+ Add Phase</Button>
          <Button variant="outlined" color="error" onClick={handleArchiveBoard}>Archive Board</Button>
        </Box>
      </Box>

      {phases.map((phase) => (
        <Accordion key={phase.id} expanded={!!openPhases[phase.id]} onChange={() => setOpenPhases({ ...openPhases, [phase.id]: !openPhases[phase.id] })}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{phase.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button variant="contained" size="small" onClick={() => handleAddTask(phase)}>+ Add Task</Button>
            </Box>

            {tasks.filter((t) => t.phaseId === phase.id && !t.archived).map((task) => (
              <Box key={task.id} display="flex" alignItems="center" justifyContent="space-between" p={1} mb={1} border="1px solid #ddd" borderRadius={2}>
                <Typography>{task.name}</Typography>
                <IconButton onClick={() => { setSelectedTask(task); setSelectedPhase(phase); setTaskDialogOpen(true); }}>
                  <EditIcon />
                </IconButton>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      {phaseDialogOpen && (
        <PhaseDialog
          open={phaseDialogOpen}
          onClose={() => setPhaseDialogOpen(false)}
          boardId={board.id}
          onPhaseAdded={fetchPhases}
        />
      )}

      {taskDialogOpen && (
        <TaskDialog
          open={taskDialogOpen}
          onClose={() => setTaskDialogOpen(false)}
          onTaskAdded={handleSaveTask}
          task={selectedTask}
          boardId={board.id}
          phaseId={selectedPhase?.id}
        />
      )}
    </Box>
  );
};

export default ProjectBoardView;