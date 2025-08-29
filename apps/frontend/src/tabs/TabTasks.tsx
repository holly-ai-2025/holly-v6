import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import { styled } from "@mui/material/styles";

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

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
}));

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
        <StyledAccordion
          key={group}
          sx={{ background: groupColors[group] || "inherit" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{group}</Typography>
            <Chip
              label={tasks[group].length}
              color="primary"
              size="small"
              sx={{ ml: 2 }}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Divider sx={{ mb: 1 }} />
            <List>
              {tasks[group].map((task) => (
                <ListItem key={task.id} divider>
                  {task.project && <FolderIcon sx={{ mr: 1, color: "text.secondary" }} />}
                  <ListItemText
                    primary={task.name}
                    secondary={
                      (group === "This Week" || group === "Later") && task.due_date
                        ? `📅 ${task.due_date}`
                        : `Due: ${task.due_date || "N/A"}`
                    }
                  />
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
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </StyledAccordion>
      ))}
    </Box>
  );
}