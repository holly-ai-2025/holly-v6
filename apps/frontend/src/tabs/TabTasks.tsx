import React, { useState, useEffect } from "react";
import { Box, Typography, Collapse, List, ListItem, ListItemText, IconButton } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface Task {
  task_id: number;
  task_name: string;
  due_date?: string | null;
  status?: string;
  priority?: string;
  notes?: string;
}

interface TaskGroups {
  [key: string]: Task[];
}

const groupTasks = (tasks: Task[]): TaskGroups => {
  const groups: TaskGroups = { Overdue: [], Today: [], Tomorrow: [], "This Week": [], Later: [] };
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  tasks.forEach((t) => {
    if (!t.due_date) {
      groups["Later"].push(t);
    } else {
      const due = new Date(t.due_date);
      if (due < today) groups["Overdue"].push(t);
      else if (due.toDateString() === today.toDateString()) groups["Today"].push(t);
      else if (due.toDateString() === tomorrow.toDateString()) groups["Tomorrow"].push(t);
      else if (due.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) groups["This Week"].push(t);
      else groups["Later"].push(t);
    }
  });
  return groups;
};

const TabTasks: React.FC = () => {
  const [tasks, setTasks] = useState<TaskGroups>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Overdue: true,
    Today: true,
    Tomorrow: true,
    "This Week": false,
    Later: false,
  });

  const fetchTasks = () => {
    fetch(`${import.meta.env.VITE_API_URL}/db/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(groupTasks(data)))
      .catch((err) => console.error("[TabTasks] Failed to fetch tasks", err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggle = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Tasks</Typography>
      {Object.entries(tasks).map(([group, groupTasks]) => (
        <Box key={group} mb={2}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" sx={{ flexGrow: 1 }}>{group}</Typography>
            <IconButton onClick={() => handleToggle(group)}>
              {openGroups[group] ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={openGroups[group]}>
            <List>
              {groupTasks.map((task) => (
                <ListItem key={task.task_id}>
                  <ListItemText
                    primary={task.task_name}
                    secondary={`${task.priority || ""} ${task.due_date ? `– due ${new Date(task.due_date).toLocaleDateString()}` : ""}`}
                  />
                </ListItem>
              ))}
              {groupTasks.length === 0 && (
                <ListItem>
                  <ListItemText primary="No tasks" />
                </ListItem>
              )}
            </List>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default TabTasks;