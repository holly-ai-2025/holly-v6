import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  IconButton,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

interface Task {
  task_id: number;
  task_name: string;
  description?: string;
  due_date?: string | null;
  status?: string;
  priority?: string;
  category?: string;
  token_value?: number;
  notes?: string;
  urgency_score?: number;
  effort_level?: number;
  created_at?: string;
  updated_at?: string;
}

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(task.status || "Pending");

  const urgencyLabel = () => {
    if (!task.urgency_score) return "Low";
    if (task.urgency_score > 70) return "High";
    if (task.urgency_score > 40) return "Medium";
    return "Low";
  };

  const effortLabel = () => {
    if (!task.effort_level) return "?";
    if (task.effort_level <= 2) return "Easy";
    if (task.effort_level <= 5) return "Medium";
    return "Hard";
  };

  const statusColors: Record<string, string> = {
    Pending: "default",
    "In Progress": "primary",
    Completed: "success",
    Blocked: "error",
  };

  return (
    <>
      <Card
        sx={{
          mb: 1.5,
          borderRadius: 2,
          boxShadow: 2,
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": { boxShadow: 4 },
        }}
        onClick={() => setOpen(true)}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold">
              {task.task_name}
            </Typography>

            {/* Token value pill */}
            {task.token_value && (
              <Chip size="small" color="secondary" label={`+${task.token_value} XP`} />
            )}
          </Box>

          {task.due_date && (
            <Tooltip title={`Due: ${new Date(task.due_date).toLocaleDateString()}`}>
              <IconButton size="small">
                <CalendarMonthIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
            <Chip size="small" label={`Urgency: ${urgencyLabel()}`} />
            <Chip size="small" label={`Effort: ${effortLabel()}`} />

            {/* Status dropdown */}
            <FormControl size="small">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{
                  fontSize: "0.75rem",
                  height: "28px",
                  color: statusColors[status] || "inherit",
                }}
              >
                {Object.keys(statusColors).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Popup dialog for details */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{task.task_name}</DialogTitle>
        <DialogContent>
          {task.description && (
            <Typography variant="body1" gutterBottom>
              {task.description}
            </Typography>
          )}

          {task.notes && (
            <Typography variant="body2" color="text.secondary">
              Notes: {task.notes}
            </Typography>
          )}

          <Typography variant="body2" mt={2}>
            Status: {status}
          </Typography>

          {task.category && (
            <Typography variant="body2">Category: {task.category}</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;