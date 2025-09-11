import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Divider, Button, Collapse, Paper } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import dayjs from "dayjs";
import TaskDialog from "../components/TaskDialog";
import { getTasks } from "../api/tasks";

interface Task {
  task_id?: number;
  task_name?: string;
  description?: string;
  due_date?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string;
  priority?: string;
  category?: string;
  project_id?: number;
  project?: string;
  phase_id?: number;
  notes?: string;
  token_value?: number;
  urgency_score?: number;
  effort_level?: string;
  board_id?: number;
  created_at?: string;
  updated_at?: string;
}

type TaskGroups = Record<string, Task[]>;

const groupTasksByDate = (tasks: Task[]): TaskGroups => {
  const groups: TaskGroups = { Overdue: [], Today: [], Tomorrow: [], ThisWeek: [], Later: [], Completed: [] };
  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");
  const endOfWeek = today.endOf("week");

  tasks.forEach((task) => {
    if (task.status === "Done") return groups.Completed.push(task);
    if (!task.due_date) return groups.Later.push(task);
    const due = dayjs(task.due_date);
    if (due.isBefore(today, "day")) groups.Overdue.push(task);
    else if (due.isSame(today, "day")) groups.Today.push(task);
    else if (due.isSame(tomorrow, "day")) groups.Tomorrow.push(task);
    else if (due.isBefore(endOfWeek, "day")) groups.ThisWeek.push(task);
    else groups.Later.push(task);
  });

  return groups;
};

const TabTasks: React.FC = () => {
  const [tasks, setTasks] = useState<TaskGroups>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(groupTasksByDate(data));
    } catch (err) {
      console.error("[TabTasks] Failed to fetch tasks", err);
      setTasks(groupTasksByDate([]));
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
    fetchTasks();
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>+ New Task</Button>
      </Box>

      {Object.keys(tasks).map((group) => (
        <Box key={group} mt={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold">{group}</Typography>
            <IconButton size="small">{tasks[group].length > 0 ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
          </Box>
          <Divider sx={{ mt: 0.5, mb: 1 }} />
          <Collapse in={true}>
            <Box mt={0.5}>
              {tasks[group].length > 0 ? (
                tasks[group].map((t) => (
                  <Paper key={t.task_id} sx={{ p: 1, mb: 1, cursor: "pointer" }} onClick={() => handleTaskClick(t)}>
                    <Typography variant="body2">{t.task_name}</Typography>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No tasks available</Typography>
              )}
            </Box>
          </Collapse>
        </Box>
      ))}

      <TaskDialog open={dialogOpen} task={selectedTask || undefined} onClose={handleDialogClose} onSave={() => fetchTasks()} />
    </Box>
  );
};

export default TabTasks;