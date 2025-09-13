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
import { Task } from "../types";
import { createTask, updateTask, deleteTask } from "../api/tasks";

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: () => void; // refresh callback
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, task, onClose, onSave }) => {
  const [formData, setFormData] = useState<Task>({
    id: 0,
    task_name: "",
    description: "",
    due_date: null,
    start_date: null,
    end_date: null,
    status: "Todo",
    priority: "Medium",
    token_value: 5,
    category: null,
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        id: 0,
        task_name: "",
        description: "",
        due_date: null,
        start_date: null,
        end_date: null,
        status: "Todo",
        priority: "Medium",
        token_value: 5,
        category: null,
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.id) {
      await updateTask(formData.id, formData);
    } else {
      await createTask(formData);
    }
    onSave();
    onClose();
  };

  const handleDelete = async () => {
    if (formData.id) {
      await deleteTask(formData.id);
      onSave();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{formData.id ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="task_name"
              value={formData.task_name}
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
            <TextField
              label="Due Date"
              name="due_date"
              type="date"
              value={formData.due_date || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Priority"
              name="priority"
              select
              value={formData.priority}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Start Time"
              name="start_date"
              type="datetime-local"
              value={formData.start_date || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Time"
              name="end_date"
              type="datetime-local"
              value={formData.end_date || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Status"
              name="status"
              select
              value={formData.status}
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
        {formData.id !== 0 && (
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