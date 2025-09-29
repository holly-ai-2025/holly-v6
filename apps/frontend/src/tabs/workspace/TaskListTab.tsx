import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import api from "../../lib/api";

const TaskListTab = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    api.get("/api/tasks").then((res) => {
      setTasks(res.data);
    });
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6">Task List</Typography>
      {tasks.length === 0 && <Typography>No tasks available.</Typography>}
      {tasks.map((task) => (
        <Box key={task.id} p={1} mb={1} bgcolor="#f9f9f9" borderRadius={2} boxShadow={1}>
          <Typography>{task.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Due: {task.due_date || "N/A"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TaskListTab;