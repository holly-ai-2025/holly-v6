import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Collapse,
  IconButton,
  Divider,
  Tooltip,
  Button,
  Paper,
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
  Overdue: "#f8d7da",
  Today: "#e6f0fa",
  Tomorrow: "#d6e9f8",
  "This Week": "#c5e0f6",
  Later: "#b5d7f3",
  Completed: "#f2f2f2",
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
  if (s === "in progress" || s === "in_progress") return "In Progress";
  if (s === "pinned") return "Pinned";
  return "Todo";
};

const toBackendStatus = (status?: string) => {
  if (!status) return "Todo";
  const s = status.toLowerCase();
  if (s === "done") return "Done";
  if (s === "in progress" || s === "in_progress") return "In Progress";
  if (s === "pinned") return "Pinned";
  return "Todo";
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
]);

const allowedPostFields = new Set([
  ...Array.from(allowedPatchFields),
  "task_name",
]);

const groupTasksByDate = (tasks: Task[]): TaskGroups => {
  const groups: TaskGroups = {
    Overdue: [],
    Today: [],
    SuggestedToday: [],
    Tomorrow: [],
    SuggestedTomorrow: [],
    "This Week": [],
    Later: [],
    Completed: [],
  };

  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");
  const endOfWeek = today.endOf("week");

  tasks.forEach((task) => {
    const status = normalizeStatus(task.status);
    if (status === "Done") {
      groups.Completed.push(task);
      return;
    }

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
    Tomorrow: true,
    "This Week": false,
    Later: false,
    Completed: false,
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

  const buildPayload = (updates: Partial<Task>, isNew: boolean): Record<string, any> => {
    const allowed = isNew ? allowedPostFields : allowedPatchFields;
    const payload: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (allowed.has(key) && value !== null && value !== "") {
        if (key === "status") {
          payload[key] = toBackendStatus(value as string);
        } else if (key === "due_date") {
          payload[key] = dayjs(value).format("YYYY-MM-DD");
        } else if (key === "start_date" || key === "end_date") {
          payload[key] = dayjs(value).format("YYYY-MM-DDTHH:mm:ss");
        } else if (key === "priority") {
          const map: Record<string, string> = {
            "1": "Tiny",
            "2": "Small",
            "3": "Medium",
            "4": "Big",
          };
          payload[key] = map[String(value)] || String(value);
        } else {
          payload[key] = value;
        }
      }
    });

    return payload;
  };

  const updateTask = async (taskId: number | undefined, updates: Partial<Task>) => {
    if (!taskId) return;

    const payload = buildPayload(updates, false);
    if (Object.keys(payload).length === 0) return;

    console.debug("[TabTasks] PATCH payload", payload);

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
    const payload = buildPayload(newTask, true);
    console.debug("[TabTasks] POST payload", payload);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/db/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
        },
        body: JSON.stringify(payload),
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

  const renderTaskRow = (task: Task) => {
    const taskId = task.task_id;
    const isCompleted = normalizeStatus(task.status) === "Done";

    return (
      <Box
        key={taskId}
        display="flex"
        alignItems="center"
        gap={0.8}
        sx={{ mb: 1, cursor: "pointer" }}
      >
        <Box sx={{ minWidth: "32px", display: "flex", justifyContent: "center" }}>
          <Checkbox
            size="small"
            sx={{ borderRadius: "50%" }}
            checked={isCompleted}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              updateTask(taskId, { status: e.target.checked ? "Done" : "Todo" });
            }}
          />
        </Box>

        {task.token_value !== undefined && (
          <Tooltip title={`Reward: ${task.token_value} tokens`} arrow>
            <Typography
              component="span"
              sx={{
                background: getTokenGradient(task.token_value),
                borderRadius: "999px",
                px: 1,
                py: 0.3,
                minWidth: "28px",
                textAlign: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.5px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              +{task.token_value}
            </Typography>
          </Tooltip>
        )}

        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={() => handleTaskClick(task)}
          sx={{
            backgroundColor: isCompleted
              ? groupColors.Completed
              : task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day")
              ? groupColors["Overdue"]
              : groupColors[task.due_date ? "Today" : "Later"] || "#fff",
            borderRadius: "14px",
            boxShadow: 1,
            py: 0.3,
            px: 1.2,
            minHeight: "28px",
            fontSize: "0.75rem",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: isCompleted ? "#888" : "inherit",
            }}
          >
            {task.task_name}
            {task.start_date && task.end_date && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                {dayjs(task.start_date).format("HH:mm")} – {dayjs(task.end_date).format("HH:mm")}
              </Typography>
            )}
          </Typography>

          {(task.project_id || task.project) && (
            <FolderIcon fontSize="small" sx={{ ml: 1, color: isCompleted ? "#aaa" : "#555" }} />
          )}
        </Box>

        <Tooltip title={`Due: ${task.due_date || "Not set"}`} arrow>
          <DatePicker
            value={task.due_date ? dayjs(task.due_date) : null}
            onChange={(newDate) =>
              updateTask(taskId, { due_date: newDate?.format("YYYY-MM-DD") })
            }
            slots={{ openPickerIcon: CalendarTodayIcon }}
            slotProps={{
              textField: { sx: { display: "none" } },
              openPickerButton: {
                sx: {
                  p: 0.5,
                  borderRadius: "50%",
                  color: "#555",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
                },
              },
            }}
          />
        </Tooltip>
      </Box>
    );
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          + New Task
        </Button>
      </Box>

      {Object.keys(tasks || {}).map((group) => {
        if (group === "SuggestedToday" || group === "SuggestedTomorrow") return null;

        const groupTasks = tasks[group] || [];
        const suggestedTasks =
          group === "Today"
            ? tasks.SuggestedToday || []
            : group === "Tomorrow"
            ? tasks.SuggestedTomorrow || []
            : [];

        return (
          <Box key={group} mt={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              onClick={() => handleToggle(group)}
              sx={{ cursor: "pointer" }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {group}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2">{groupTasks.length}</Typography>
                <IconButton size="small">
                  {openGroups[group] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>
            <Divider sx={{ mt: 0.5, mb: 1 }} />

            <Collapse in={openGroups[group]}>
              <Box mt={0.5}>
                {groupTasks.map(renderTaskRow)}
                {suggestedTasks.length > 0 && (
                  <Paper elevation={2} sx={{ mt: 2, p: 1, backgroundColor: "#f0f0f0" }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      Suggested
                    </Typography>
                    <Box mt={0.5}>{suggestedTasks.map(renderTaskRow)}</Box>
                  </Paper>
                )}
              </Box>
            </Collapse>
          </Box>
        );
      })}

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