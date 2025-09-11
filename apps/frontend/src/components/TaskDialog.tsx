import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

interface TaskDialogProps {
  open: boolean;
  task?: any;
  onClose: () => void;
  onSave: (task: any) => void;
}

const priorities = ["Low", "Medium", "High"];
const statuses = ["Todo", "In Progress", "Done", "Pinned"];

export default function TaskDialog({ open, task, onClose, onSave }: TaskDialogProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Todo");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTaskName(task.task_name || "");
      setDescription(task.description || "");
      setDueDate(task.due_date ? dayjs(task.due_date) : null);
      setStartDate(task.start_date ? dayjs(task.start_date) : null);
      setEndDate(task.end_date ? dayjs(task.end_date) : null);
      setPriority(task.priority || "Medium");
      setStatus(task.status || "Todo");
    } else {
      setTaskName("");
      setDescription("");
      setDueDate(null);
      setStartDate(null);
      setEndDate(null);
      setPriority("Medium");
      setStatus("Todo");
    }
    setSubmitting(false);
  }, [task, open]);

  const handleSave = async () => {
    if (submitting) {
      console.warn("[TaskDialog] Prevented duplicate submit");
      return;
    }
    setSubmitting(true);

    const payload: any = {
      task_name: taskName,
      description,
      due_date: dueDate ? dueDate.format("YYYY-MM-DD") : null,
      start_date: startDate ? startDate.format("YYYY-MM-DDTHH:mm:ss") : null,
      end_date: endDate ? endDate.format("YYYY-MM-DDTHH:mm:ss") : null,
      priority,
      status,
    };

    if (task?.task_id) {
      console.log("[TaskDialog] PATCH payload", payload);
      onSave({ ...payload, task_id: task.task_id });
    } else {
      console.log("[TaskDialog] POST payload", payload);
      onSave(payload);
    }

    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Task Name"
          fullWidth
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <DatePicker
          label="Due Date"
          value={dueDate}
          onChange={(newValue) => setDueDate(newValue)}
          slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
        />
        <TimePicker
          label="Start Time"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
        />
        <TimePicker
          label="End Time"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
        />
        <TextField
          margin="dense"
          label="Priority"
          fullWidth
          select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {priorities.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Status"
          fullWidth
          select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}