import React, { useState, useEffect, useCallback } from "react";
import FullCalendar, {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventResizeDoneArg,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Button, Typography } from "@mui/material";
import TaskDialog from "../components/TaskDialog";
import { Task } from "../types";
import { getTasks, createTask, updateTask } from "../api/tasks";
import "../styles/CalendarStyles.css";

const TabCalendar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      const unique = Array.from(new Map(data.map((t: Task) => [t.id, t])).values());
      setTasks(unique);
    } catch (err) {
      console.error("[TabCalendar] Failed to fetch tasks", err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const { start, end } = selectInfo;
    setSelectedTask({
      id: 0,
      task_name: "",
      description: "",
      due_date: start.toISOString().split("T")[0],
      start_date: start.toISOString(),
      end_date: end ? end.toISOString() : null,
      status: "Todo",
      priority: "Medium",
      token_value: 5,
      category: null,
    });
    setDialogOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const task = tasks.find((t) => t.id === Number(clickInfo.event.id));
    if (task) {
      setSelectedTask(task);
      setDialogOpen(true);
    }
  };

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    const task = tasks.find((t) => t.id === Number(dropInfo.event.id));
    if (task) {
      const updated: Task = {
        ...task,
        start_date: dropInfo.event.start?.toISOString() || null,
        end_date: dropInfo.event.end?.toISOString() || null,
        due_date: dropInfo.event.start?.toISOString().split("T")[0] || null,
      };
      await updateTask(updated.id, updated);
      fetchTasks();
    }
  };

  const handleEventResize = async (resizeInfo: EventResizeDoneArg) => {
    const task = tasks.find((t) => t.id === Number(resizeInfo.event.id));
    if (task) {
      const updated: Task = {
        ...task,
        start_date: resizeInfo.event.start?.toISOString() || null,
        end_date: resizeInfo.event.end?.toISOString() || null,
      };
      await updateTask(updated.id, updated);
      fetchTasks();
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Calendar</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedTask(null);
            setDialogOpen(true);
          }}
        >
          + New Task
        </Button>
      </Box>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={tasks.map((t) => ({
          id: t.id.toString(),
          title: t.task_name,
          start: t.start_date || t.due_date,
          end: t.end_date,
          classNames: [
            t.status === "Todo"
              ? "event-todo"
              : t.status === "In Progress"
              ? "event-inprogress"
              : t.status === "Done"
              ? "event-completed"
              : "event-pinned",
          ],
        }))}
        selectable
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        editable
        height="auto"
      />

      {dialogOpen && (
        <TaskDialog
          open={dialogOpen}
          task={selectedTask}
          onClose={() => setDialogOpen(false)}
          onSave={fetchTasks}
        />
      )}
    </Box>
  );
};

export default TabCalendar;