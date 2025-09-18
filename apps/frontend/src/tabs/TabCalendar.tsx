import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Task, getTasks, updateTask } from "../api/tasks";
import TaskDialog from "../components/TaskDialog";
import dayjs from "dayjs";

const TabCalendar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      const active = data.filter((t: Task) => !t.archived); // hide archived
      setTasks(active);
    } catch (err) {
      console.error("[TabCalendar] Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEventClick = (info: any) => {
    const task = tasks.find((t) => t.id?.toString() === info.event.id);
    if (task) {
      setSelectedTask(task);
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDialogSave = async (form: Partial<Task>) => {
    try {
      if (selectedTask && selectedTask.id) {
        await updateTask(selectedTask.id, form);
      }
      fetchTasks();
    } catch (err) {
      console.error("[TabCalendar] Failed to save task", err);
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const task = tasks.find((t) => t.id?.toString() === eventInfo.event.id);
    if (!task) return null;

    const status = task.status?.toLowerCase() || "todo";
    const isCompleted = status === "done";
    const isOverdue =
      (status === "todo" || status === "in progress") &&
      task.dueDate &&
      dayjs(task.dueDate).isBefore(dayjs(), "day");

    let bgColor = "#b5d7f3"; // Later group blue
    let textColor = "#000";

    if (isOverdue) {
      bgColor = "#f8d7da";
    } else if (isCompleted) {
      bgColor = "#f2f2f2";
      textColor = "#888";
    }

    return (
      <Box
        sx={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: "14px",
          px: 1.2,
          py: 0.3,
          fontSize: "0.9rem",
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          boxShadow:
            "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
        }}
      >
        {eventInfo.event.title}
      </Box>
    );
  };

  return (
    <Box p={2}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: "prev,today,next", center: "title", right: "day,week,month" }}
        events={tasks.map((task) => ({
          id: task.id?.toString() || "",
          title: task.name,
          start: task.startDate || task.dueDate || undefined,
          end: task.endDate || undefined,
        }))}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        height="auto"
      />

      <TaskDialog
        open={dialogOpen}
        task={selectedTask}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
      />
    </Box>
  );
};

export default TabCalendar;