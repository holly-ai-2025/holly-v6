import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Grid,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface TaskDialogProps {
  open: boolean;
  task?: any | null;
  onClose: () => void;
  onSave: (updates: Partial<any>) => void;
}

const statuses = ["Todo", "In Progress", "Done"];

export default function TaskDialog({ open, task, onClose, onSave }: TaskDialogProps) {
  const [form, setForm] = useState<Partial<any>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);

  useEffect(() => {
    setForm(task || {});
  }, [task]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/db/projects`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("[TaskDialog] Failed to fetch projects", err));
  }, []);

  useEffect(() => {
    if (form.project_id) {
      fetch(`${import.meta.env.VITE_API_URL}/db/projects/${form.project_id}/phases`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
      })
        .then((res) => res.json())
        .then((data) => setPhases(data))
        .catch((err) => console.error("[TaskDialog] Failed to fetch phases", err));
    } else {
      setPhases([]);
    }
  }, [form.project_id]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Task Name */}
          <TextField
            label="Task Name"
            value={form.task_name || ""}
            onChange={(e) => handleChange("task_name", e.target.value)}
            fullWidth
            size="medium"
          />

          {/* Description */}
          <TextField
            label="Description"
            value={form.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            multiline
            rows={2}
            size="small"
          />

          {/* Row: Due Date + Priority + Category */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <DatePicker
                label="Due Date"
                value={form.due_date ? dayjs(form.due_date) : null}
                onChange={(date: Dayjs | null) =>
                  handleChange("due_date", date ? date.format("YYYY-MM-DD") : null)
                }
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Priority"
                value={form.priority || ""}
                onChange={(e) => handleChange("priority", e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Category"
                value={form.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>

          {/* Row: Project + Phase + Status */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth size="medium">
                <InputLabel>Project</InputLabel>
                <Select
                  value={form.project_id || ""}
                  onChange={(e) => handleChange("project_id", e.target.value)}
                >
                  {projects.map((p) => (
                    <MenuItem key={p.project_id} value={p.project_id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="medium">
                <InputLabel>Phase</InputLabel>
                <Select
                  value={form.phase_id || ""}
                  onChange={(e) => handleChange("phase_id", e.target.value)}
                  disabled={!form.project_id}
                >
                  {phases.map((ph) => (
                    <MenuItem key={ph.phase_id} value={ph.phase_id}>
                      {ph.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Status"
                select
                value={form.status || "Todo"}
                onChange={(e) => handleChange("status", e.target.value)}
                fullWidth
                size="small"
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Token Value */}
          <TextField
            label="Token Value"
            type="number"
            value={form.token_value || ""}
            onChange={(e) => handleChange("token_value", parseInt(e.target.value))}
            fullWidth
            size="small"
          />

          {/* Notes */}
          <Box flexGrow={1} display="flex" flexDirection="column">
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Notes
            </Typography>
            <ReactQuill
              theme="snow"
              value={form.notes || ""}
              onChange={(value) => handleChange("notes", value)}
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                minHeight: "400px",
                maxHeight: "60vh",
                flexGrow: 1,
                overflowY: "auto",
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}