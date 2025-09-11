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
import dayjs from "dayjs";
import { createTask, updateTask } from "../api/tasks";

interface TaskDialogProps {
  open: boolean;
  task?: any;
  onClose: () => void;
  onSave: (updates: any) => void;
  externalSave?: boolean; // ✅ new prop
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, task, onClose, onSave, externalSave = false }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setFormData(task || {});
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (externalSave) {
      // ✅ Skip backend calls, delegate to parent
      onSave(formData);
      return;
    }

    try {
      if (task?.task_id) {
        await updateTask(task.task_id, formData);
      } else {
        await createTask(formData);
      }
      onSave(formData);
    } catch (err) {
      console.error("[TaskDialog] Failed to save task", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="task_name"
          label="Task Name"
          type="text"
          fullWidth
          value={formData.task_name || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          minRows={3}
          value={formData.description || ""}
          onChange={handleChange}
        />
        <TextField
          select
          margin="dense"
          name="status"
          label="Status"
          fullWidth
          value={formData.status || "Todo"}
          onChange={handleChange}
        >
          <MenuItem value="Todo">Todo</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
          <MenuItem value="Pinned">Pinned</MenuItem>
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
};

export default TaskDialog;