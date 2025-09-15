import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { Task, createTask, updateTask } from "../api/tasks";

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: () => void;
  defaultStart?: Dayjs | null;
  defaultEnd?: Dayjs | null;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, task, onClose, onSave, defaultStart, defaultEnd }) => {
  const [form, setForm] = useState<Partial<Task>>({});

  useEffect(() => {
    if (task) {
      setForm(task);
    } else {
      setForm({
        startDate: defaultStart?.toISOString() || null,
        endDate: defaultEnd?.toISOString() || null,
      });
    }
  }, [task, defaultStart, defaultEnd]);

  const handleChange = (field: keyof Task, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (task && task.id) {
        await updateTask(task.id, form);
      } else {
        await createTask(form);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("[TaskDialog] Failed to save task", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={6}>
            <DatePicker
              label="Start Date"
              value={form.startDate ? dayjs(form.startDate) : null}
              onChange={(date) => handleChange("startDate", date?.toISOString())}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              label="Start Time"
              value={form.startDate ? dayjs(form.startDate) : null}
              onChange={(time) => {
                if (time) {
                  const newDate = dayjs(form.startDate || new Date()).hour(time.hour()).minute(time.minute());
                  handleChange("startDate", newDate.toISOString());
                }
              }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid item xs={6}>
            <DatePicker
              label="End Date"
              value={form.endDate ? dayjs(form.endDate) : null}
              onChange={(date) => handleChange("endDate", date?.toISOString())}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              label="End Time"
              value={form.endDate ? dayjs(form.endDate) : null}
              onChange={(time) => {
                if (time) {
                  const newDate = dayjs(form.endDate || new Date()).hour(time.hour()).minute(time.minute());
                  handleChange("endDate", newDate.toISOString());
                }
              }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Priority"
              select
              value={form.priority || ""}
              onChange={(e) => handleChange("priority", e.target.value)}
              fullWidth
            >
              {["Tiny", "Small", "Medium", "Big"].map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Status"
              select
              value={form.status || "Todo"}
              onChange={(e) => handleChange("status", e.target.value)}
              fullWidth
            >
              {["Todo", "In Progress", "Done", "Pinned"].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Category"
              value={form.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Board ID"
              type="number"
              value={form.boardId || ""}
              onChange={(e) => handleChange("boardId", Number(e.target.value))}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Phase ID"
              type="number"
              value={form.phaseId || ""}
              onChange={(e) => handleChange("phaseId", Number(e.target.value))}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Project ID"
              type="number"
              value={form.projectId || ""}
              onChange={(e) => handleChange("projectId", Number(e.target.value))}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Token Value"
              type="number"
              value={form.tokenValue || ""}
              onChange={(e) => handleChange("tokenValue", Number(e.target.value))}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Urgency Score"
              type="number"
              value={form.urgencyScore || ""}
              onChange={(e) => handleChange("urgencyScore", Number(e.target.value))}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Effort Level"
              value={form.effortLevel || ""}
              onChange={(e) => handleChange("effortLevel", e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Notes"
              value={form.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;