import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import { createTask, updateTask } from "../api/tasks";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  task?: any;
  onDelete?: (taskId: string) => void;
}

export default function TaskDialog({ open, onClose, onSave, task, onDelete }: TaskDialogProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Todo");

  useEffect(() => {
    if (task) {
      setTaskName(task.task_name || "");
      setDescription(task.description || "");
      setDueDate(task.due_date ? dayjs(task.due_date, ["DDMMYYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD") : null);
      setStartTime(task.start_date ? dayjs(task.start_date).format("HH:mm") : null);
      setEndTime(task.end_date ? dayjs(task.end_date).format("HH:mm") : null);
      setPriority(task.priority || "Medium");
      setStatus(task.status || "Todo");
    }
  }, [task]);

  const handleSave = async () => {
    if (!taskName.trim()) return;

    const payload: any = {
      task_name: taskName,
      description,
      due_date: dueDate || null,
      start_date: startTime && dueDate ? `${dueDate}T${startTime}:00` : null,
      end_date: endTime && dueDate ? `${dueDate}T${endTime}:00` : null,
      priority,
      status,
    };

    try {
      let saved;
      if (task?.task_id) {
        saved = await updateTask(task.task_id, payload);
      } else {
        saved = await createTask(payload);
      }
      onSave(saved);
    } catch (err) {
      console.error("[TaskDialog] Failed to save task", err);
    }
  };

  const handleDelete = async () => {
    if (!task?.task_id) return;
    try {
      const res = await fetch(`http://localhost:8000/db/tasks/${task.task_id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (onDelete) onDelete(task.task_id);
        onClose();
      }
    } catch (err) {
      console.error("[TaskDialog] Failed to delete task", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Date"
              type="date"
              value={dueDate || ""}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Start Time"
              type="time"
              value={startTime || ""}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="End Time"
              type="time"
              value={endTime || ""}
              onChange={(e) => setEndTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              fullWidth
            >
              <MenuItem value="Tiny">Tiny</MenuItem>
              <MenuItem value="Small">Small</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Big">Big</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="Todo">Todo</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
              <MenuItem value="Pinned">Pinned</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {task?.task_id && (
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}