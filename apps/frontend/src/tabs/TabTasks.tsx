import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  Checkbox,
  Paper,
  Stack,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";

interface Task {
  id: string;
  name: string;
  due_date?: string;
  status?: string;
  priority?: string;
  project?: string;
  category?: string;
}

// Colors per group (Overdue = red, rest in blues)
const groupColors: Record<string, string> = {
  Overdue: "#f8d7da", // softer red than before
  Today: "#e3f2fd",   // light blue
  Tomorrow: "#bbdefb", // medium light blue
  "This Week": "#90caf9", // medium blue
  Later: "#64b5f6",   // darker blue
};

export default function TabTasks() {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  return (
    <Box p={2}>
      {Object.keys(tasks).map((group) => (
        <Box key={group} mb={3}>
          <Stack direction="row" alignItems="center" mb={1}>
            <Typography variant="h6">{group}</Typography>
            <Chip
              label={tasks[group].length}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          </Stack>
          <Divider sx={{ mb: 2 }} />

          <List>
            {tasks[group].map((task) => (
              <Paper
                key={task.id}
                sx={{
                  background: groupColors[group] || "#f5f5f5",
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {task.project && <FolderIcon fontSize="small" color="action" />}
                  {task.category && (
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "#4A90E2", // placeholder, could map categories to colors later
                      }}
                    />
                  )}
                  <ListItemText
                    primary={task.name}
                    secondary={task.due_date ? `📅 ${task.due_date}` : undefined}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Select
                    size="small"
                    value={task.status || "todo"}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="todo">Todo</MenuItem>
                    <MenuItem value="in progress">In Progress</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                  </Select>
                  <Checkbox />
                </Box>
              </Paper>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
}