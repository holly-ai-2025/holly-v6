import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Collapse,
  IconButton,
  Divider,
  Select,
  MenuItem,
  Tooltip,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import TaskDialog from "../components/TaskDialog";

interface Task {
  task_id?: number;
  task_name?: string;
  description?: string;
  due_date?: string | null;
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
  Overdue: "#fdecea",
  Today: "#e6f0fa",
  SuggestedToday: "#f5faff",
  Tomorrow: "#d6e9f8",
  SuggestedTomorrow: "#eef7ff",
  "This Week": "#c5e0f6",
  Later: "#b5d7f3",
};

const getTokenGradient = (value?: number) => {
  switch (value) {
    case 5:
      return "linear-gradient(135deg, #00e0ff, #00cfff)";
    case 10:
      return "linear-gradient(135deg, #3399ff, #0088ff)";
    case 15:
      return "linear-gradient(135deg, #5c4dff, #4b32ff)";
    case 20:
      return "linear-gradient(135deg, #9d4bff, #8a2be2)";
    default:
      return "linear-gradient(135deg, #e0e0e0, #c0c0c0)";
  }
};

const normalizeStatus = (status?: string) => {
  if (!status) return "Todo";
  const s = status.toLowerCase();
  if (s === "done") return "Done";
  if (s === "in progress") return "In Progress";
  if (s === "pinned") return "Pinned";
  return "Todo";
};

const statusColors: Record<string, string> = {
  Todo: "#ccc",
  "In Progress": "orange",
  Done: "green",
  Pinned: "purple",
};

const groupTasksByDate = (tasks: Task[]): TaskGroups => {
  const groups: TaskGroups = {
    Overdue: [],
    Today: [],
    SuggestedToday: [],
    Tomorrow: [],
    SuggestedTomorrow: [],
    "This Week": [],
    Later: [],
  };

  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");
  const endOfWeek = today.endOf("week");

  tasks.forEach((task) => {
    const status = normalizeStatus(task.status);
    if (status === "Done") return;

    if (!task.due_date) {
      if ((task.urgency_score || 0) > 5) {
        groups.SuggestedToday.push(task);
      } else {
        groups.SuggestedTomorrow.push(task);
      }
      return;
    }

    const due = dayjs(task.due_date);
    if (due.isBefore(today, "day")) {
      groups.Overdue.push(task);
    } else if (due.isSame(today, "day")) {
      groups.Today.push(task);
    } else if (due.isSame(tomorrow, "day")) {
      groups.Tomorrow.push(task);
    } else if (due.isBefore(endOfWeek, "day")) {
      groups["This Week"].push(task);
    } else {
      groups.Later.push(task);
    }
  });

  return groups;
};

const TabTasks: React.FC = () => {
  const [tasks, setTasks] = useState<TaskGroups>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Overdue: true,
    Today: true,
    SuggestedToday: true,
    Tomorrow: true,
    SuggestedTomorrow: true,
    "This Week": false,
    Later: false,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = () => {
    fetch(`${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(groupTasksByDate(data));
        } else {
          setTasks(data);
        }
      })
      .catch((err) => console.error("[TabTasks] Failed to fetch tasks", err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggle = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const updateTask = async (taskId: number | undefined, updates: Partial<Task>) => {
    if (!taskId) return;
    const { created_at, updated_at, ...payload } = updates;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/db/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update task");
      fetchTasks();
    } catch (err) {
      console.error("[TabTasks] Failed to update task", err);
    }
  };

  const createTask = async (newTask: Partial<Task>) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/db/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
        },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error("Failed to create task");
      fetchTasks();
    } catch (err) {
      console.error("[TabTasks] Failed to create task", err);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDialogSave = async (updates: Partial<Task>) => {
    if (selectedTask && selectedTask.task_id) {
      await updateTask(selectedTask.task_id, updates);
    } else {
      await createTask(updates);
    }
    handleDialogClose();
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          + New Task
        </Button>
      </Box>

      {Object.entries(tasks).map(([group, groupTasks]) => (
        <Box key={group} mb={2}>
          <Box display="flex" alignItems="center" onClick={() => handleToggle(group)} sx={{ cursor: "pointer" }}>
            <IconButton size="small">{openGroups[group] ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
            <Typography variant="h6">{group}</Typography>
          </Box>
          <Collapse in={openGroups[group]}>
            {groupTasks.map((task) => (
              <Box
                key={task.task_id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={1}
                mb={1}
                borderRadius={2}
                sx={{ background: groupColors[group] || "#f0f0f0" }}
              >
                <Checkbox
                  checked={normalizeStatus(task.status) === "Done"}
                  onChange={() => updateTask(task.task_id, { status: "Done" })}
                />
                <Typography
                  sx={{ flex: 1, cursor: "pointer" }}
                  onClick={() => handleTaskClick(task)}
                >
                  {task.task_name}
                </Typography>
                {task.token_value ? (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: getTokenGradient(task.token_value),
                    }}
                  />
                ) : null}
                {task.project_id ? (
                  <Tooltip title="Linked to project">
                    <FolderIcon fontSize="small" />
                  </Tooltip>
                ) : null}
                <DatePicker
                  value={task.due_date ? dayjs(task.due_date) : null}
                  onChange={(newDate) =>
                    updateTask(task.task_id, { due_date: newDate ? newDate.format("YYYY-MM-DD") : null })
                  }
                  slotProps={{ textField: { variant: "standard", size: "small" } }}
                />
                <Select
                  value={normalizeStatus(task.status)}
                  onChange={(e) => updateTask(task.task_id, { status: e.target.value })}
                  size="small"
                  sx={{ ml: 1, minWidth: 120, background: "white" }}
                >
                  {Object.keys(statusColors).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            ))}
          </Collapse>
          <Divider />
        </Box>
      ))}

      <TaskDialog
        open={dialogOpen}
        task={selectedTask}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
      />
    </Box>
  );
};

export default TabTasks;
