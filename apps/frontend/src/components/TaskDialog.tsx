import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import { normalizeTaskForApi } from "../utils/taskUtils";

function toInputDate(ddmmyyyy: string): string {
  if (!ddmmyyyy || ddmmyyyy.length !== 8) return "";
  return `${ddmmyyyy.slice(4, 8)}-${ddmmyyyy.slice(2, 4)}-${ddmmyyyy.slice(0, 2)}`;
}

function toDDMMYYYY(iso: string): string {
  if (!iso || iso.length !== 10) return "";
  const [year, month, day] = iso.split("-");
  return `${day}${month}${year}`;
}

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  task?: any;
}

export default function TaskDialog({ open, onClose, onSave, task }: TaskDialogProps) {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTaskName(task.task_name || "");
      setDueDate(task.due_date ? toInputDate(task.due_date) : null);
      setStartTime(task.start_date ? dayjs(task.start_date).format("HH:mm:ss") : null);
      setEndTime(task.end_date ? dayjs(task.end_date).format("HH:mm:ss") : null);
    }
  }, [task]);

  const handleSave = () => {
    if (!taskName.trim()) return;

    const payload: any = {
      task_name: taskName,
      due_date: dueDate ? toDDMMYYYY(dueDate) : null,
      start_date: startTime && dueDate ? dayjs(`${dueDate}T${startTime}`).format("YYYY-MM-DDTHH:mm:ss") : null,
      end_date: endTime && dueDate ? dayjs(`${dueDate}T${endTime}`).format("YYYY-MM-DDTHH:mm:ss") : null,
    };

    if (task?.task_id) payload.task_id = task.task_id;

    onSave(normalizeTaskForApi(payload));
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
              label="Due Date"
              type="date"
              value={dueDate || ""}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}