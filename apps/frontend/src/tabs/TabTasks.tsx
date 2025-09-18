import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Collapse,
  IconButton,
  Divider,
  Tooltip,
  Button,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FolderIcon from "@mui/icons-material/Folder";
import { Task, getTasks, createTask, updateTask } from "../api/tasks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import dayjs from "dayjs";
import TaskDialog from "../components/TaskDialog";

const groupColors: Record<string, string> = {
  Overdue: "#f8d7da",
  Today: "#e6f0fa",
  Tomorrow: "#d6e9f8",
  "This Week": "#c5e0f6",
  Later: "#b5d7f3",
  Completed: "#f2f2f2",
};

const normalizeStatus = (status?: string) => {
  if (!status) return "Todo";
  const s = status.toLowerCase();
  if (s === "done") return "Done";
  if (s === "in progress" || s === "in_progress") return "In Progress";
  if (s === "pinned") return "Pinned";
  return "Todo";
};

const groupTasksByDate = (tasks: Task[]) => {
  const groups: Record<string, Task[]> = {
    Overdue: [],
    Today: [],
    SuggestedToday: [],
    Tomorrow: [],
    SuggestedTomorrow: [],
    "This Week": [],
    Later: [],
    Completed: [],
  };

  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");
  const endOfWeek = today.endOf("week");

  tasks.forEach((task) => {
    const status = normalizeStatus(task.status);
    if (status === "Done") {
      groups.Completed.push(task);
      return;
    }

    const effectiveDate = task.startDate || task.dueDate || null;

    if (!effectiveDate) {
      if ((task.urgencyScore || 0) > 5) {
        groups.SuggestedToday.push(task);
      } else {
        groups.SuggestedTomorrow.push(task);
      }
      return;
    }

    const due = dayjs(effectiveDate).startOf("day");

    if (due.isBefore(today, "day")) {
      groups.Overdue.push(task);
    } else if (due.isSame(today, "day")) {
      groups.Today.push(task);
    } else if (due.isSame(tomorrow, "day")) {
      groups.Tomorrow.push(task);
    } else if (due.isBefore(endOfWeek, "day")) {
      groups["This Week"].push(task);
    } else {
      groups.Later.push(task);
    }
  });

  const sortByDate = (arr: Task[]) =>
    arr.sort(
      (a, b) =>
        dayjs(a.startDate || a.dueDate).valueOf() -
        dayjs(b.startDate || b.dueDate).valueOf()
    );

  sortByDate(groups.Overdue);
  sortByDate(groups.Today);
  sortByDate(groups.Tomorrow);
  sortByDate(groups["This Week"]);
  sortByDate(groups.Later);

  return groups;
};

const TabTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Task[]>>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Overdue: true,
    Today: true,
    Tomorrow: true,
    "This Week": false,
    Later: false,
    Completed: false,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      setGrouped(groupTasksByDate(data));
    } catch (err) {
      console.error("[TabTasks] Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggle = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleDialogSave = async (form: Partial<Task>) => {
    try {
      if (selectedTask && selectedTask.id) {
        await updateTask(selectedTask.id, form);
      } else {
        await createTask(form);
      }
      fetchTasks();
    } catch (err) {
      console.error("[TabTasks] Failed to save task", err);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { destination, draggableId } = result;
    const taskId = parseInt(draggableId);
    const toGroup = destination.droppableId;

    if (toGroup === "Later" || toGroup === "Completed" || toGroup === "Overdue") {
      return;
    }

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const prevTasks = [...tasks];

    let updates: Partial<Task> = {};

    if (toGroup === "Today") {
      updates = { dueDate: dayjs().toISOString(), startDate: null };
    } else if (toGroup === "Tomorrow") {
      updates = { dueDate: dayjs().add(1, "day").toISOString(), startDate: null };
    }

    if (updates.dueDate !== undefined) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
      setGrouped(groupTasksByDate(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t))));

      try {
        await updateTask(taskId, updates);
      } catch (err) {
        console.error("[TabTasks] Drag update failed", err);
        setTasks(prevTasks);
        setGrouped(groupTasksByDate(prevTasks));
      }
    }
  };

  const renderTaskRow = (task: Task, groupName: string, index: number) => {
    const isCompleted = normalizeStatus(task.status) === "Done";

    let bgColor = "#fff";
    if (groupName === "Overdue") {
      bgColor = groupColors.Overdue;
    } else if (groupName === "Later") {
      bgColor = groupColors.Later;
    } else if (groupName === "Today") {
      bgColor = groupColors.Today;
    } else if (groupName === "Tomorrow") {
      bgColor = groupColors.Tomorrow;
    } else if (groupName === "This Week") {
      bgColor = groupColors["This Week"];
    } else if (isCompleted) {
      bgColor = groupColors.Completed;
    }

    return (
      <Draggable draggableId={task.id!.toString()} index={index} key={task.id}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            display="flex"
            alignItems="center"
            gap={0.8}
            sx={{ mb: 1, cursor: "pointer" }}
          >
            <Box sx={{ minWidth: "32px", display: "flex", justifyContent: "center" }}>
              <Checkbox
                size="small"
                sx={{ borderRadius: "50%" }}
                checked={isCompleted}
                onClick={(e) => e.stopPropagation()}
                onChange={async (e) => {
                  e.stopPropagation();
                  await updateTask(task.id!, { status: e.target.checked ? "Done" : "Todo" });
                  fetchTasks();
                }}
              />
            </Box>

            {task.tokenValue !== undefined && (
              <Tooltip title={`Reward: ${task.tokenValue} tokens`} arrow>
                <Typography
                  component="span"
                  sx={{
                    background: "#3399ff",
                    borderRadius: "999px",
                    px: 1,
                    py: 0.3,
                    minWidth: "28px",
                    textAlign: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.5px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  +{task.tokenValue}
                </Typography>
              </Tooltip>
            )}

            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              onClick={() => handleTaskClick(task)}
              sx={{
                backgroundColor: bgColor,
                borderRadius: "14px",
                boxShadow: 1,
                py: 0.3,
                px: 1.2,
                minHeight: "28px",
                fontSize: "0.75rem",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: isCompleted ? "#888" : "inherit",
                }}
              >
                {task.name}
                {task.startDate && task.endDate && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 0.5 }}
                  >
                    {dayjs(task.startDate).format("HH:mm")} – {dayjs(task.endDate).format("HH:mm")}
                  </Typography>
                )}
              </Typography>

              {(task.projectId || (task as any).project) && (
                <FolderIcon fontSize="small" sx={{ ml: 1, color: isCompleted ? "#aaa" : "#555" }} />
              )}
            </Box>
          </Box>
        )}
      </Draggable>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box p={2}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            + New Task
          </Button>
        </Box>

        {Object.keys(grouped || {}).map((group) => {
          if (group === "SuggestedToday" || group === "SuggestedTomorrow") return null;

          const groupTasks = grouped[group] || [];
          const suggestedTasks =
            group === "Today"
              ? grouped.SuggestedToday || []
              : group === "Tomorrow"
              ? grouped.SuggestedTomorrow || []
              : [];

          return (
            <Box key={group} mt={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                onClick={() => handleToggle(group)}
                sx={{ cursor: "pointer" }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {group}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">{groupTasks.length}</Typography>
                  <IconButton size="small">
                    {openGroups[group] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
              </Box>
              <Divider sx={{ mt: 0.5, mb: 1 }} />

              <Collapse in={openGroups[group]}>
                <Droppable droppableId={group}>
                  {(provided) => (
                    <Box mt={0.5} ref={provided.innerRef} {...provided.droppableProps}>
                      {groupTasks.map((task, index) => renderTaskRow(task, group, index))}
                      {suggestedTasks.length > 0 && (
                        <Paper elevation={2} sx={{ mt: 2, p: 1, backgroundColor: "#f0f0f0" }}>
                          <Typography variant="caption" fontWeight="bold" color="text.secondary">
                            Suggested
                          </Typography>
                          <Box mt={0.5}>
                            {suggestedTasks.map((task, index) =>
                              renderTaskRow(task, group, groupTasks.length + index)
                            )}
                          </Box>
                        </Paper>
                      )}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Collapse>
            </Box>
          );
        })}

        <TaskDialog
          open={dialogOpen}
          task={selectedTask}
          onClose={handleDialogClose}
          onSave={handleDialogSave}
        />
      </Box>
    </DragDropContext>
  );
};

export default TabTasks;