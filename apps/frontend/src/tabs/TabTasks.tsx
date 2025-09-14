import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { getTasks, Task } from "../api/tasks";
import dayjs from "dayjs";

const TabTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("[TabTasks] Failed to fetch tasks", err);
    }
  };

  const grouped = {
    overdue: tasks.filter((t) => t.dueDate && dayjs(t.dueDate).isBefore(dayjs(), "day")),
    today: tasks.filter((t) => t.dueDate && dayjs(t.dueDate).isSame(dayjs(), "day")),
    upcoming: tasks.filter((t) => t.dueDate && dayjs(t.dueDate).isAfter(dayjs(), "day")),
    unscheduled: tasks.filter((t) => !t.dueDate),
  };

  const renderGroup = (title: string, groupTasks: Task[]) => (
    <Box mb={3}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2">({groupTasks.length})</Typography>
        <Tooltip title={`Tasks in ${title}`} arrow>
          <span>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Grid container spacing={1}>
        {groupTasks.map((task) => (
          <Grid item xs={12} key={task.id}>
            <Paper sx={{ p: 1.5, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography fontWeight="medium">{task.name || "(Untitled)"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.dueDate ? dayjs(task.dueDate).format("MMM D, YYYY") : "No due date"}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {task.status}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  return (
    <Box p={2}>
      {renderGroup("Overdue", grouped.overdue)}
      {renderGroup("Today", grouped.today)}
      {renderGroup("Upcoming", grouped.upcoming)}
      {renderGroup("Unscheduled", grouped.unscheduled)}
    </Box>
  );
};

export default TabTasks;