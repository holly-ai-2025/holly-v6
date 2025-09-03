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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FolderIcon from "@mui/icons-material/Folder";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface Task {
  token_value?: number;
  task_id?: string;
  id?: string;
  task_name?: string;
  name?: string;
  description?: string;
  due_date?: string;
  status?: string;
  priority?: string;
  category?: string;
  project_id?: string;
  project?: string;
  phase_id?: string;
}

type TaskGroups = Record<string, Task[]>;

const groupColors: Record<string, string> = {
  Overdue: "#fdecea",
  Today: "#e6f0fa",
  Tomorrow: "#d6e9f8",
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

const TabTasks: React.FC = () => {
  const [tasks, setTasks] = useState<TaskGroups>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Overdue: true,
    Today: true,
    Tomorrow: true,
    "This Week": false,
    Later: false,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("[TabTasks] Failed to fetch tasks", err));
  }, []);

  const handleToggle = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const updateTask = async (taskId: string | undefined, updates: Partial<Task>) => {
    if (!taskId) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/db/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
        },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error("[TabTasks] Failed to update task", err);
    }
  };

  const normalizeStatus = (status?: string) => {
    if (!status) return "Todo";
    const s = status.toLowerCase();
    if (s === "done") return "Done";
    if (s === "in progress") return "In Progress";
    return "Todo";
  };

  return (
    <Box p={2}>
      {Object.keys(tasks || {}).map((group) => (
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
              <Typography variant="body2">{tasks[group]?.length || 0}</Typography>
              <IconButton size="small">
                {openGroups[group] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ mt: 0.5, mb: 1 }} />

          <Collapse in={openGroups[group]}>
            <Box mt={0.5}>
              {tasks[group]?.map((task) => {
                const taskId = task.task_id || task.id;
                return (
                  <Box
                    key={taskId}
                    display="flex"
                    alignItems="center"
                    gap={1.2}
                    sx={{ mb: 1 }}
                  >
                    {/* Checkbox: toggles Done/Todo */}
                    <Box sx={{ minWidth: "32px", display: "flex", justifyContent: "center" }}>
                      <Checkbox
                        size="small"
                        sx={{ borderRadius: "50%" }}
                        checked={normalizeStatus(task.status) === "Done"}
                        onChange={(e) =>
                          updateTask(taskId, {
                            status: e.target.checked ? "Done" : "Todo",
                          })
                        }
                      />
                    </Box>

                    {task.token_value !== undefined && (
                      <Tooltip title={`Reward: ${task.token_value} tokens`} arrow>
                        <Typography
                          component="span"
                          sx={{
                            background: getTokenGradient(task.token_value),
                            borderRadius: "999px",
                            px: 1.2,
                            py: 0.2,
                            minWidth: "30px",
                            textAlign: "center",
                            fontSize: "0.65rem",
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
                        {task.task_name || task.name}
                      </Typography>

                      {(task.project_id || task.project) && (
                        <FolderIcon fontSize="small" sx={{ ml: 1, color: "#555" }} />
                      )}

                      {/* Compact Date Picker */}
                      <DatePicker
                        value={task.due_date ? dayjs(task.due_date) : null}
                        onChange={(newDate) =>
                          updateTask(taskId, {
                            due_date: newDate?.format("YYYY-MM-DD"),
                          })
                        }
                        slotProps={{
                          textField: {
                            size: "small",
                            sx: {
                              ml: 1,
                              borderRadius: "14px",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                                backgroundColor: "#fff",
                                height: "22px",
                                "& fieldset": { border: "none" },
                              },
                              "& .MuiInputBase-input": {
                                px: 0.8,
                                fontSize: "0.65rem",
                                textAlign: "center",
                                py: 0,
                              },
                              "& .MuiIconButton-root": {
                                color: "#666",
                                fontSize: "0.8rem",
                                p: 0,
                              },
                            },
                          },
                        }}
                      />

                      {/* Status Dropdown */}
                      <Select
                        size="small"
                        value={normalizeStatus(task.status)}
                        onChange={(e) => updateTask(taskId, { status: e.target.value })}
                        sx={{
                          ml: 1,
                          borderRadius: "14px",
                          fontSize: "0.65rem",
                          height: "22px",
                          backgroundColor: "#fff",
                          "& .MuiSelect-select": {
                            px: 0.8,
                            py: 0,
                            fontSize: "0.65rem",
                            textAlign: "center",
                          },
                        }}
                      >
                        <MenuItem value="Todo">Todo</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Done">Done</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default TabTasks;