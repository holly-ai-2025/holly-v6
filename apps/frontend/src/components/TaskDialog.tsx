import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { DateCalendar, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Task, createTask, updateTask, deleteTask } from "../api/tasks";

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: () => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, task, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    id: 0,
    name: "",
    description: "",
    dueDate: undefined,
    startDate: undefined,
    endDate: undefined,
    status: "Todo",
    priority: "Medium",
    tokenValue: 5,
    category: undefined,
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        id: 0,
        name: "",
        description: "",
        dueDate: undefined,
        startDate: undefined,
        endDate: undefined,
        status: "Todo",
        priority: "Medium",
        tokenValue: 5,
        category: undefined,
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.id && formData.id !== 0) {
      await updateTask(formData.id, formData);
    } else {
      await createTask(formData);
    }
    onSave();
    onClose();
  };

  const handleDelete = async () => {
    if (formData.id && formData.id !== 0) {
      await deleteTask(formData.id);
      onSave();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{formData.id && formData.id !== 0 ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={6}>
            <DateCalendar
              value={formData.dueDate ? dayjs(formData.dueDate) : null}
              onChange={(newDate) =>
                setFormData((prev) => ({ ...prev, dueDate: newDate?.format("YYYY-MM-DD") }))
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Priority"
              name="priority"
              select
              value={formData.priority || "Medium"}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              label="Start Time"
              value={formData.startDate ? dayjs(formData.startDate) : null}
              onChange={(newTime) =>
                setFormData((prev) => ({ ...prev, startDate: newTime?.toISOString() }))
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              label="End Time"
              value={formData.endDate ? dayjs(formData.endDate) : null}
              onChange={(newTime) =>
                setFormData((prev) => ({ ...prev, endDate: newTime?.toISOString() }))
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Status"
              name="status"
              select
              value={formData.status || "Todo"}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Todo">Todo</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {formData.id && formData.id !== 0 && (
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
};

export default TaskDialog;