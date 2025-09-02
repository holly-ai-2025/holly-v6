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

const groupColors: Record<string, string> = {
  Overdue: "#fdecea",
  Today: "#e3f2fd",
  Tomorrow: "#bbdefb",
  "This Week": "#f3e5f5",
  Later: "#d1c4e9",
};

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
        <Box key={group} sx={{ mb: 2 }}>
          {/* Group header */}
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", mb: 1 }}
            onClick={() => toggleGroup(group)}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {group}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Chip label={tasks[group].length} color="primary" size="small" sx={{ mr: 1 }} />
              <IconButton size="small">
                {openGroups[group] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ mb: 1 }} />

          {/* Task list */}
          <Collapse in={openGroups[group]}>
            <List>
              {tasks[group].map((task) => (
                <ListItem key={task.id} disableGutters sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                  {/* Checkbox outside card */}
                  <Checkbox
                    sx={{
                      mr: 1.5,
                      "& .MuiSvgIcon-root": { borderRadius: "50%" },
                    }}
                  />

                  <Paper
                    sx={{
                      p: 1.5,
                      width: "100%",
                      borderRadius: 2,
                      boxShadow: 1,
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
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: categoryColors[task.category || "Other"],
                          mr: 1,
                        }}
                      />

                      {/* Folder icon if part of project */}
                      {task.project && (
                        <FolderIcon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />
                      )}

                      {/* Task text */}
                      <ListItemText
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "caption" }}
                        primary={task.name}
                        secondary={task.due_date ? `📅 ${task.due_date}` : "No due date"}
                      />
                    </Box>

                    {/* Controls */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Select
                        size="small"
                        value={task.status || "todo"}
                        sx={{ mr: 1, minWidth: 110 }}
                      >
                        <MenuItem value="todo">Todo</MenuItem>
                        <MenuItem value="in progress">In Progress</MenuItem>
                        <MenuItem value="done">Done</MenuItem>
                      </Select>
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