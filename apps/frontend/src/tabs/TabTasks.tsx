import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Collapse,
  Paper,
  Checkbox,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import dayjs from "dayjs";
import TaskDialog from "../components/TaskDialog";
import { getTasks, updateTask } from "../api/tasks";

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

const groupColors: Record<string, string> = {
  Overdue: "#f55c5c",
  Today: "#f57c00",
  Tomorrow: "#f5b400",
  ThisWeek: "#5a96f5",
  Later: "#5cc9f5",
  Completed: "#66bb6a",
  SuggestedToday: "#9c27b0",
  SuggestedTomorrow: "#ab47bc",
};

const groupTasksByDate = (tasks: Task[]): TaskGroups => {
  const groups: TaskGroups = {
    Overdue: [],
    Today: [],
    Tomorrow: [],
    ThisWeek: [],
    Later: [],
    Completed: [],
    SuggestedToday: [],
    SuggestedTomorrow: [],
  };
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

const allowedPatchFields = new Set([
  "status",
  "priority",
  "due_date",
  "start_date",
  "end_date",
  "project_id",
  "phase_id",
  "notes",
  "description",
  "token_value",
  "urgency_score",
  "effort_level",
  "category",
  "task_name",
]);

const buildPayload = (updates: Partial<Task>): Record<string, any> => {
  const payload: Record<string, any> = {};
  Object.entries(updates).forEach(([key, value]) => {
    if (allowedPatchFields.has(key) && value !== null && value !== "") {
      if (key === "due_date") {
        payload[key] = dayjs(value).format("YYYY-MM-DD");
      } else if (key === "start_date" || key === "end_date") {
        payload[key] = dayjs(value).format("YYYY-MM-DDTHH:mm:ss");
      } else {
        payload[key] = value;
      }
    }
  });
  return payload;
};

const TabTasks: React.FC = () => {
  const [tasks, setTasks] = useState<TaskGroups>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      if (Array.isArray(data)) {
        setTasks(groupTasksByDate(data));
      }
    } catch (err) {
      console.error("[TabTasks] Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleCheckboxToggle = async (task: Task) => {
    if (!task.task_id) return;
    const newStatus = task.status === "Done" ? "Todo" : "Done";
    const payload = buildPayload({ status: newStatus });
    try {
      await updateTask(task.task_id, payload);
      fetchTasks();
    } catch (err) {
      console.error("[TabTasks] Failed to update task status", err);
    }
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
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: groupColors[group] || "inherit", borderRadius: 1, p: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">{group}</Typography>
            <IconButton size="small">{tasks[group].length > 0 ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
          </Box>
          <Divider sx={{ mt: 0.5, mb: 1 }} />
          <Collapse in={true}>
            <Box mt={0.5}>
              {tasks[group].length > 0 ? (
                tasks[group].map((t) => (
                  <Paper key={t.task_id} sx={{ p: 1, mb: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={() => handleTaskClick(t)}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Checkbox checked={t.status === "Done"} onClick={(e) => { e.stopPropagation(); handleCheckboxToggle(t); }} />
                      <Typography variant="body2">{t.task_name}</Typography>
                    </Box>
                    {t.token_value ? (
                      <Tooltip title={`Tokens: ${t.token_value}`}>
                        <Box sx={{ background: "linear-gradient(45deg, #f57c00, #fbc02d)", color: "white", px: 1, borderRadius: 1, fontSize: 12 }}>{t.token_value}</Box>
                      </Tooltip>
                    ) : null}
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