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
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
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

// Background colors for task groups
const groupColors: Record<string, string> = {
  Overdue: "#fdecea",
  Today: "#e3f2fd",
  Tomorrow: "#bbdefb",
  "This Week": "#f3e5f5",
  Later: "#d1c4e9",
};

// Category color mapping (fallback to gray if undefined)
const categoryColors: Record<string, string> = {
  Work: "#42a5f5",
  Personal: "#66bb6a",
  Health: "#ef5350",
  Study: "#ab47bc",
  Other: "#9e9e9e",
};

export default function TabTasks() {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        // default: all groups open
        const init: Record<string, boolean> = {};
        Object.keys(data).forEach((g) => (init[g] = true));
        setOpenGroups(init);
      });
  }, []);

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <Box p={2}>
      {Object.keys(tasks).map((group) => (
        <Box key={group} sx={{ mb: 3 }}>
          {/* Group header */}
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", mb: 1 }} onClick={() => toggleGroup(group)}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {group}
            </Typography>
            <Chip label={tasks[group].length} color="primary" size="small" sx={{ ml: 2 }} />
            <IconButton size="small" sx={{ ml: 1 }}>
              {openGroups[group] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {/* Task list */}
          <Collapse in={openGroups[group]}>
            <List>
              {tasks[group].map((task) => (
                <ListItem key={task.id} disableGutters sx={{ mb: 2 }}>
                  <Paper
                    sx={{
                      p: 2,
                      width: "100%",
                      borderRadius: 3,
                      boxShadow: 2,
                      background: groupColors[group] || "#fafafa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {/* Category dot */}
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor:
                            categoryColors[task.category || "Other"],
                          mr: 1.5,
                        }}
                      />

                      {/* Folder icon if part of project */}
                      {task.project && (
                        <FolderIcon sx={{ mr: 1, color: "text.secondary" }} />
                      )}

                      {/* Task text */}
                      <ListItemText
                        primary={task.name}
                        secondary={task.due_date ? `📅 ${task.due_date}` : "No due date"}
                      />
                    </Box>

                    {/* Controls */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Select
                        size="small"
                        value={task.status || "todo"}
                        sx={{ mr: 2, minWidth: 120 }}
                      >
                        <MenuItem value="todo">Todo</MenuItem>
                        <MenuItem value="in progress">In Progress</MenuItem>
                        <MenuItem value="done">Done</MenuItem>
                      </Select>
                      <Checkbox />
                    </Box>
                  </Paper>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
}