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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  background: theme.palette.background.paper,
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
        <StyledAccordion key={group}>
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
                  <ListItemText
                    primary={task.name}
                    secondary={`Due: ${task.due_date || "N/A"} | Status: ${
                      task.status || "todo"
                    } | Priority: ${task.priority || "-"}`}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </StyledAccordion>
      ))}
    </Box>
  );
}