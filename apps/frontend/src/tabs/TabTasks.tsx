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

const backendStatusMap: Record<string, string> = {
  Todo: "todo",
  "In Progress": "in_progress",
  Done: "done",
  Pinned: "pinned",
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

    // normalize values before sending
    if (payload.status) {
      payload.status = backendStatusMap[normalizeStatus(payload.status)] || payload.status;
    }
    if (payload.due_date) {
      payload.due_date = dayjs(payload.due_date).format("YYYY-MM-DD");
    }

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

      {Object.keys(tasks || {}).map((group) => {
        const groupTasks = tasks[group] || [];
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
                {groupTasks.map((task) => {
                  const taskId = task.task_id;
                  return (
                    <Box
                      key={taskId}
                      display="flex"
                      alignItems="center"
                      gap={1.2}
                      sx={{ mb: 1, cursor: "pointer" }}
                      onClick={() => handleTaskClick(task)}
                    >
                      {/* Checkbox */}
                      <Box sx={{ minWidth: "32px", display: "flex", justifyContent: "center" }}>
                        <Checkbox
                          size="small"
                          sx={{ borderRadius: "50%" }}
                          checked={normalizeStatus(task.status) === "Done"}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateTask(taskId, {
                              status: e.target.checked ? "Done" : "Todo",
                            });
                          }}
                        />
                      </Box>

                      {/* Tokens */}
                      {task.token_value !== undefined && (
                        <Tooltip title={`Reward: ${task.token_value} tokens`} arrow>
                          <Typography
                            component="span"
                            sx={{
                              background: getTokenGradient(task.token_value),
                              borderRadius: "999px",
                              px: 1.4,
                              py: 0.4,
                              minWidth: "36px",
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

                      {/* Task card */}
                      <Box
                        flex={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          backgroundColor: groupColors[group] || "#fff",
                          borderRadius: "14px",
                          boxShadow: 1,
                          py: 0.3,
                          px: 0.6,
                          minHeight: "28px",
                          fontSize: "0.75rem",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            flex: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {task.task_name}
                        </Typography>

                        {(task.project_id || task.project) && (
                          <FolderIcon fontSize="small" sx={{ ml: 1, color: "#555" }} />
                        )}

                        {/* Due date */}
                        <Tooltip title={`Due: ${task.due_date || "Not set"}`} arrow>
                          <DatePicker
                            value={task.due_date ? dayjs(task.due_date) : null}
                            onChange={(newDate) =>
                              updateTask(taskId, {
                                due_date: newDate?.format("YYYY-MM-DD"),
                              })
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

                        {/* Status select */}
                        <Tooltip title={normalizeStatus(task.status)} arrow>
                          <Select
                            size="small"
                            value={normalizeStatus(task.status)}
                            onChange={(e) => updateTask(taskId, { status: e.target.value })}
                            sx={{
                              ml: 1,
                              borderRadius: "50%",
                              width: "22px",
                              height: "22px",
                              backgroundColor: statusColors[normalizeStatus(task.status)],
                              "& .MuiSelect-select": {
                                p: 0,
                                fontSize: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              },
                              "& svg": {
                                fontSize: "1rem",
                                color: "#fff",
                              },
                              "& fieldset": { border: "none" },
                            }}
                          >
                            <MenuItem value="Todo">⚪</MenuItem>
                            <MenuItem value="In Progress">🟠</MenuItem>
                            <MenuItem value="Done">🟢</MenuItem>
                            <MenuItem value="Pinned">🟣</MenuItem>
                          </Select>
                        </Tooltip>
                      </Box>
                    </Box>
                  );
                })}
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
