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
  Divider,
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

// Valid backend enums
const statuses = ["Todo", "In Progress", "Done", "Pinned"];
const priorities = ["Tiny", "Small", "Medium", "Big"];

export default function TaskDialog({ open, task, onClose, onSave }: TaskDialogProps) {
  const [form, setForm] = useState<Partial<any>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [boards, setBoards] = useState<any[]>([]);
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

    fetch(`${import.meta.env.VITE_API_URL}/db/boards`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => setBoards(data))
      .catch((err) => console.error("[TaskDialog] Failed to fetch boards", err));
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
    // Ensure only valid enums are sent
    const cleanedForm = { ...form };

    if (!statuses.includes(cleanedForm.status)) {
      cleanedForm.status = "Todo";
    }

    if (!priorities.includes(cleanedForm.priority)) {
      cleanedForm.priority = "Small";
    }

    onSave(cleanedForm);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{task && task.task_id ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* --- Core Details --- */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Details</Typography>
            <TextField
              label="Task Name"
              value={form.task_name || ""}
              onChange={(e) => handleChange("task_name", e.target.value)}
              fullWidth
              size="medium"
              sx={{ mb: 2 }}
              disabled={task && task.task_id} // disable editing task_name when updating
            />
            <TextField
              label="Description"
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
              multiline
              rows={2}
              size="small"
            />
          </Box>

          <Divider />

          {/* --- Scheduling --- */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Scheduling</Typography>
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
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={form.status && statuses.includes(form.status) ? form.status : "Todo"}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    {statuses.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={form.priority && priorities.includes(form.priority) ? form.priority : "Small"}
                    onChange={(e) => handleChange("priority", e.target.value)}
                  >
                    {priorities.map((lvl) => (
                      <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* --- Urgency --- */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Urgency</Typography>
            <TextField
              label="Urgency Score"
              value={form.urgency_score || 0}
              onChange={(e) => handleChange("urgency_score", Number(e.target.value))}
              fullWidth
              size="small"
              type="number"
            />
          </Box>

          <Divider />

          {/* --- Notes --- */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Notes</Typography>
            <ReactQuill
              theme="snow"
              value={form.notes || ""}
              onChange={(value) => handleChange("notes", value)}
              style={{ height: "200px", borderRadius: "8px" }}
            />
          </Box>

          <Divider />

          {/* --- Assignment --- */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Assignment</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Board</InputLabel>
                  <Select
                    value={form.board_id || ""}
                    onChange={(e) => handleChange("board_id", e.target.value)}
                  >
                    {boards.map((b) => (
                      <MenuItem key={b.board_id} value={b.board_id}>{b.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Project</InputLabel>
                  <Select
                    value={form.project_id || ""}
                    onChange={(e) => handleChange("project_id", e.target.value)}
                  >
                    {projects.map((p) => (
                      <MenuItem key={p.project_id} value={p.project_id}>{p.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}