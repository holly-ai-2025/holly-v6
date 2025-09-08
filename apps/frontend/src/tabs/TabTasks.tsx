import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Chip,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TaskDialog from "../components/TaskDialog";

// --- Status mappings ---
const statusMap: Record<string, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
  pinned: "Pinned",
};

const reverseStatusMap: Record<string, string> = Object.fromEntries(
  Object.entries(statusMap).map(([k, v]) => [v, k])
);

// --- Helper to compute changed fields ---
const getChangedFields = (original: any, updated: any) => {
  const changed: any = {};
  Object.keys(updated).forEach((key) => {
    if (updated[key] !== original[key]) {
      changed[key] = updated[key];
    }
  });
  return changed;
};

// --- Clean payload before sending ---
const cleanPayload = (payload: any) => {
  const cleaned: any = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      key !== "task_id" &&
      key !== "created_at" &&
      key !== "updated_at"
    ) {
      if (key === "status") {
        cleaned[key] = reverseStatusMap[value as string] || value;
      } else if (key === "due_date") {
        cleaned[key] = new Date(value as string).toISOString().split("T")[0];
      } else {
        cleaned[key] = value;
      }
    }
  });
  return cleaned;
};

export default function TabTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // --- Fetch tasks ---
  useEffect(() => {
    fetch("http://localhost:8000/db/tasks")
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((t: any) => ({
          ...t,
          status: statusMap[t.status] || t.status,
        }));
        setTasks(normalized);
      });
  }, []);

  // --- Handle update ---
  const handleUpdate = async (task: any, updates: any) => {
    const changed = getChangedFields(task, updates);
    const payload = cleanPayload(changed);

    console.debug("[TabTasks] PATCH payload –", payload);

    try {
      const res = await fetch(`http://localhost:8000/db/tasks/${task.task_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.task_id === task.task_id ? { ...t, ...updatedTask } : t))
      );
    } catch (err) {
      console.error("[TabTasks] Failed to update task", err);
    }
  };

  return (
    <Box>
      {tasks.map((task) => (
        <Box
          key={task.task_id}
          sx={{ display: "flex", alignItems: "center", gap: 2, p: 1, borderBottom: "1px solid #ddd" }}
        >
          <Checkbox
            checked={task.status === "Done"}
            onChange={(e) => handleUpdate(task, { status: e.target.checked ? "Done" : "Todo" })}
          />
          <Typography sx={{ flexGrow: 1 }}>{task.task_name}</Typography>
          <Chip label={task.token_value} />
          <DatePicker
            value={task.due_date}
            onChange={(newDate) =>
              handleUpdate(task, { due_date: newDate ? newDate.toISOString() : null })
            }
            slotProps={{ textField: { size: "small" } }}
          />
          <Select
            value={task.status}
            onChange={(e) => handleUpdate(task, { status: e.target.value })}
            size="small"
          >
            {Object.values(statusMap).map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
          <IconButton onClick={() => setSelectedTask(task)}>✏️</IconButton>
        </Box>
      ))}

      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={(updates) => handleUpdate(selectedTask, updates)}
        />
      )}
    </Box>
  );
}