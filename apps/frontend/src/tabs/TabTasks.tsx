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
import { DateCalendar, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import TaskDialog from "../components/TaskDialog";
import { Task, getTasks, updateTask as apiUpdateTask } from "../api/tasks";

// ... (rest of file remains unchanged up to renderTaskRow)

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
        {/* ...checkbox and token UI unchanged... */}

        <Box flex={1} display="flex" alignItems="center" justifyContent="space-between" onClick={() => handleTaskClick(task)}
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
          }}>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: isCompleted ? "#888" : "inherit" }}>
            {task.name}
          </Typography>

          {task.projectId && (
            <FolderIcon fontSize="small" sx={{ ml: 1, color: isCompleted ? "#aaa" : "#555" }} />
          )}
        </Box>

        {/* Due Date Picker */}
        <Tooltip title={`Due: ${task.dueDate || "Not set"}`} arrow>
          <span>
            <DateCalendar
              value={task.dueDate ? dayjs(task.dueDate) : null}
              onChange={(newDate) => updateTask(taskId, { dueDate: newDate?.format("YYYY-MM-DD") })}
            />
          </span>
        </Tooltip>

        {/* Start/End Time Pickers */}
        <TimePicker
          label="Start"
          value={task.startDate ? dayjs(task.startDate) : null}
          onChange={(newTime) => updateTask(taskId, { startDate: newTime?.toISOString() })}
        />
        <TimePicker
          label="End"
          value={task.endDate ? dayjs(task.endDate) : null}
          onChange={(newTime) => updateTask(taskId, { endDate: newTime?.toISOString() })}
        />
      </Box>
    );
  };

// ... (rest of file unchanged)
