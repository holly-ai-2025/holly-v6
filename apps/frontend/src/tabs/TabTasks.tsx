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

// keep all existing type definitions, helpers, normalizeStatus, getTokenGradient, etc.

const suggestedGroups: string[] = ["SuggestedToday", "SuggestedTomorrow"];

const TabTasks: React.FC = () => {
  // ... state and effect logic unchanged

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          + New Task
        </Button>
      </Box>

      {tasks && typeof tasks === "object" && Object.keys(tasks).map((group) => {
        const groupTasks = Array.isArray(tasks[group]) ? tasks[group] : [];
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
                      sx={{
                        mb: 1,
                        cursor: "pointer",
                        pl: suggestedGroups.includes(group) ? 4 : 0,
                      }}
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
                              backgroundColor: statusColors[normalizeStatus(task.status)] || "#ccc",
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