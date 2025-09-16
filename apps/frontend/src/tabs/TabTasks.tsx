import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskDialog from "../components/TaskDialog";
import { getTasks, createTask, updateTask } from "../api/tasks";

interface Task {
  id: number;
  name: string;
  description?: string | null;
  dueDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  boardId?: number | null;
  projectId?: number | null;
  phaseId?: number | null;
}

const TabTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("[TabTasks] Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (task: Partial<Task>) => {
    try {
      const newTask = await createTask(task);
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error("[TabTasks] Failed to create task", error);
    }
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const updated = await updateTask(id, updates);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
      );
    } catch (error) {
      console.error("[TabTasks] Failed to update task", error);
    }
  };

  const groupTasks = () => {
    const today: Task[] = [];
    const tomorrow: Task[] = [];
    const overdue: Task[] = [];
    const suggested: Task[] = [];

    const now = new Date();
    const todayDate = now.toISOString().split("T")[0];
    const tomorrowDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    )
      .toISOString()
      .split("T")[0];

    tasks.forEach((task) => {
      if (!task.dueDate) {
        suggested.push(task);
      } else if (task.dueDate < todayDate) {
        overdue.push(task);
      } else if (task.dueDate === todayDate) {
        today.push(task);
      } else if (task.dueDate === tomorrowDate) {
        tomorrow.push(task);
      } else {
        suggested.push(task);
      }
    });

    return { today, tomorrow, overdue, suggested };
  };

  const { today, tomorrow, overdue, suggested } = groupTasks();

  const handleDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId, 10);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Compute new dueDate
    let newDueDate: string | null = null;
    const now = new Date();
    if (destination.droppableId === "today") {
      newDueDate = now.toISOString().split("T")[0];
    } else if (destination.droppableId === "tomorrow") {
      newDueDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      )
        .toISOString()
        .split("T")[0];
    } else if (destination.droppableId === "overdue") {
      newDueDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      )
        .toISOString()
        .split("T")[0];
    } else if (destination.droppableId === "suggested") {
      newDueDate = null;
    }

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, dueDate: newDueDate } : t))
    );

    try {
      await handleUpdateTask(taskId, { dueDate: newDueDate });
    } catch (error) {
      console.error("[TabTasks] Drag update failed", error);
      // Rollback
      setTasks((prev) => prev.map((t) => (t.id === taskId ? task : t)));
    }
  };

  const renderTaskList = (title: string, taskList: Task[], droppableId: string) => (
    <Box sx={{ flex: 1, minWidth: 250, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 100 }}>
            {taskList.map((task, index) => (
              <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                      p: 1,
                      mb: 1,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography>{task.name}</Typography>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {renderTaskList("Today", today, "today")}
        {renderTaskList("Tomorrow", tomorrow, "tomorrow")}
        {renderTaskList("Overdue", overdue, "overdue")}
        {renderTaskList("Suggested", suggested, "suggested")}
      </DragDropContext>

      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        New Task
      </Button>

      <TaskDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleCreateTask}
      />
    </Box>
  );
};

export default TabTasks;