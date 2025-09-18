import React, { useEffect, useState } from "react";
import { Box, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskDialog from "../components/TaskDialog";
import { getTasks, createTask, updateTask, deleteTask, Task } from "../api/tasks";

const groupTasksByDate = (tasks: Task[]) => {
  const groups: { [key: string]: Task[] } = {};
  tasks.forEach((task) => {
    const date = task.dueDate ? task.dueDate.split("T")[0] : "No Due Date";
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
  });
  return groups;
};

const TabTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<{ [key: string]: Task[] }>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
    setGroupedTasks(groupTasksByDate(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDialogOpen = (task: Task | null = null) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDialogSave = async (payload: Partial<Task>) => {
    if (selectedTask && selectedTask.id) {
      await updateTask(selectedTask.id, payload);
    } else {
      await createTask(payload);
    }
    await fetchTasks();
  };

  const handleDialogDelete = async (task: Task) => {
    if (task.id) {
      await deleteTask(task.id);
      await fetchTasks();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Tasks
      </Typography>
      {Object.entries(groupedTasks).map(([date, tasks]) => (
        <Box key={date} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {date}
          </Typography>
          {tasks.map((task) => (
            <Box
              key={task.id}
              onClick={() => handleDialogOpen(task)}
              sx={{
                p: 1,
                my: 1,
                border: "1px solid #ccc",
                borderRadius: 1,
                cursor: "pointer",
              }}
            >
              <Typography>{task.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {task.status}
              </Typography>
            </Box>
          ))}
        </Box>
      ))}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => handleDialogOpen(null)}
      >
        <AddIcon />
      </Fab>

      <TaskDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        task={selectedTask}
        onSave={handleDialogSave}
        onDelete={handleDialogDelete}
      />
    </Box>
  );
};

export default TabTasks;