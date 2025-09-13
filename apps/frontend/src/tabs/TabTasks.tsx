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
import { Task, getTasks, updateTask as apiUpdateTask } from "../api/tasks";

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

    const date = task.dueDate || task.startDate;
    if (!date) {
      if ((task.urgencyScore || 0) > 5) {
        groups.SuggestedToday.push(task);
      } else {
        groups.SuggestedTomorrow.push(task);
      }
      return;
    }

    const due = dayjs(date);
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

  const updateTask = async (taskId: number | undefined, updates: Partial<Task>) => {
    if (!taskId) return;

    try {
      await apiUpdateTask(taskId, updates);
      fetchTasks();
    } catch (err) {
      console.error("[TabTasks] Failed to update task", err);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
    fetchTasks();
  };

  const handleDialogSave = async (updates: Partial<Task>) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, updates);
    }
    handleDialogClose();
  };

  const renderTaskRow = (task: Task) => {
    const taskId = task.id;
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

        {task.tokenValue !== undefined && (
          <Tooltip title={`Reward: ${task.tokenValue} tokens`} arrow>
            <Typography
              component="span"
              sx={{
                background: getTokenGradient(task.tokenValue),
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
              +{task.tokenValue}
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
              : task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), "day")
              ? groupColors["Overdue"]
              : groupColors[task.dueDate ? "Today" : "Later"] || "#fff",
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
            {task.name}
            {task.startDate && task.endDate && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                {dayjs(task.startDate).format("HH:mm")} – {dayjs(task.endDate).format("HH:mm")}
              </Typography>
            )}
          </Typography>

          {task.projectId && (
            <FolderIcon fontSize="small" sx={{ ml: 1, color: isCompleted ? "#aaa" : "#555" }} />
          )}
        </Box>

        <Tooltip title={`Due: ${task.dueDate || task.startDate || "Not set"}`} arrow>
          <DatePicker
            value={task.dueDate ? dayjs(task.dueDate) : task.startDate ? dayjs(task.startDate) : null}
            onChange={(newDate) =>
              updateTask(taskId, { dueDate: newDate?.format("YYYY-MM-DD") })
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
              onClick={() => setOpenGroups({ ...openGroups, [group]: !openGroups[group] })}
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

            <Collapse in={openGroups[group]} timeout="auto" unmountOnExit>
              <Paper variant="outlined" sx={{ mt: 1, p: 1 }}>
                {groupTasks.map(renderTaskRow)}
                {suggestedTasks.map(renderTaskRow)}
              </Paper>
            </Collapse>

            <Divider sx={{ my: 1.5 }} />
          </Box>
        );
      })}

      {dialogOpen && (
        <TaskDialog
          open={dialogOpen}
          task={selectedTask}
          onClose={handleDialogClose}
          onSave={fetchTasks}
        />
      )}
    </Box>
  );
};

export default TabTasks;