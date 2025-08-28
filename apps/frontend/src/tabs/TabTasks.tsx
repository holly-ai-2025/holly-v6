import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Chip,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"; // backend URL
const OPS_TOKEN = import.meta.env.VITE_OPS_TOKEN; // auth token from .env

interface Task {
  id: string;
  name: string;
  due_date: string;
  status?: string;
  priority?: string;
  project?: string;
  category?: string;
}

type GroupedTasks = {
  [key: string]: Task[];
};

export default function TabTasks() {
  const [tasks, setTasks] = useState<GroupedTasks>({});

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch(`${API_URL}/db/tasks`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPS_TOKEN}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch tasks: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    }

    if (OPS_TOKEN) {
      fetchTasks();
    } else {
      console.error("Missing VITE_OPS_TOKEN in frontend .env");
    }
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Tasks
      </Typography>

      {Object.entries(tasks).map(([group, list]) => (
        <Accordion key={group} defaultExpanded={group === "Overdue"}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {group} ({list.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {list.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No tasks
              </Typography>
            )}
            {list.map((task) => (
              <Box
                key={task.id}
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <Checkbox size="small" />
                <Typography sx={{ flex: 1 }}>{task.name}</Typography>

                {task.due_date && (
                  <Typography sx={{ width: 100 }} variant="body2">
                    {task.due_date}
                  </Typography>
                )}

                <Stack direction="row" spacing={1}>
                  {task.project && <Chip size="small" label={task.project} />}
                  {task.priority && (
                    <Chip
                      size="small"
                      label={task.priority}
                      color={
                        task.priority === "High"
                          ? "error"
                          : task.priority === "Medium"
                          ? "warning"
                          : "default"
                      }
                    />
                  )}
                  {task.status && <Chip size="small" label={task.status} />}
                </Stack>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

