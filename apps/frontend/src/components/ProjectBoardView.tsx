import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getPhases, createPhase, Phase } from "../api/phases";
import { getTasks, createTask, updateTask, Task } from "../api/tasks";
import { getProjects, Project } from "../api/projects";
import { Board } from "../api/boards";

interface ProjectBoardViewProps {
  board: Board;
}

const ProjectBoardView: React.FC<ProjectBoardViewProps> = ({ board }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newPhaseName, setNewPhaseName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    fetchProject();
  }, [board.id]);

  useEffect(() => {
    if (project) {
      fetchPhases(project.id);
      fetchTasks();
    }
  }, [project]);

  const fetchProject = async () => {
    try {
      const data = await getProjects();
      console.log("[ProjectBoardView] Projects:", data, "Board:", board.id);
      const linked = data.find((p: Project) => p.boardId === board.id);
      if (linked) {
        setProject(linked);
      } else {
        console.warn("[ProjectBoardView] No project linked for board", board.id);
      }
    } catch (err) {
      console.error("[ProjectBoardView] Failed to fetch project", err);
    }
  };

  const fetchPhases = async (projectId: number) => {
    try {
      const data = await getPhases();
      const projectPhases = data.filter((p: Phase) => p.projectId === projectId);

      if (projectPhases.length === 0) {
        const defaultPhase = await createPhase({ projectId, name: "Phase 1" });
        setPhases([defaultPhase]);
      } else {
        setPhases(projectPhases);
      }
    } catch (err) {
      console.error("[ProjectBoardView] Failed to fetch phases", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data.filter((t: Task) => t.boardId === board.id));
    } catch (err) {
      console.error("[ProjectBoardView] Failed to fetch tasks", err);
    }
  };

  const handleAddPhase = async () => {
    if (!newPhaseName || !project) return;
    try {
      await createPhase({ projectId: project.id, name: newPhaseName });
      setNewPhaseName("");
      fetchPhases(project.id);
    } catch (err) {
      console.error("[ProjectBoardView] Failed to create phase", err);
    }
  };

  const handleAddTask = async (phaseId: number) => {
    if (!newTaskName) return;
    try {
      await createTask({
        boardId: board.id,
        phaseId: phaseId,
        taskName: newTaskName,
        status: "todo",
      });
      setNewTaskName("");
      fetchTasks();
    } catch (err) {
      console.error("[ProjectBoardView] Failed to create task", err);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    try {
      const newStatus = task.status === "done" ? "todo" : "done";
      await updateTask(task.id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error("[ProjectBoardView] Failed to update task", err);
    }
  };

  if (!project) {
    return (
      <Box p={2}>
        <Typography variant="body1" color="text.secondary">
          Loading project...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Box sx={{ height: 8, backgroundColor: board.color || "#ccc", borderRadius: 2, mb: 2 }} />
        <Typography variant="h5" fontWeight="bold">{board.name}</Typography>
        <Typography variant="body2" color="text.secondary">{board.description}</Typography>
      </Paper>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          size="small"
          label="New Phase"
          value={newPhaseName}
          onChange={(e) => setNewPhaseName(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddPhase}>Add Phase</Button>
      </Box>

      {phases.map((phase) => (
        <Accordion key={phase.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{phase.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                size="small"
                label="New Task"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />
              <Button variant="contained" onClick={() => handleAddTask(phase.id)}>Add Task</Button>
            </Box>

            <Grid container spacing={1}>
              {tasks.filter((t) => t.phaseId === phase.id).map((task) => (
                <Grid item xs={12} key={task.id}>
                  <Paper
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Checkbox
                        checked={task.status === "done"}
                        onChange={() => toggleTaskStatus(task)}
                      />
                      <Typography
                        sx={{
                          textDecoration: task.status === "done" ? "line-through" : "none",
                          color: task.status === "done" ? "text.secondary" : "text.primary",
                        }}
                      >
                        {task.taskName}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ProjectBoardView;