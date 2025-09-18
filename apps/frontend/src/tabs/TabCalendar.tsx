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
import { Paper } from "@mui/material";
import { Task, getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import TaskDialog from "../components/TaskDialog";
import "../styles/calendar.css";
import dayjs from "dayjs";

const groupColors: Record<string, string> = {
  Overdue: "#f8d7da",
  Completed: "#f2f2f2",
  Later: "#b5d7f3",
};

const TabCalendar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultStart, setDefaultStart] = useState<any>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      const active = res.filter((t: Task) => !t.archived); // hide archived (soft-deleted)
      setTasks(active);
    } catch (err) {
      console.error("[TabCalendar] Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const task = tasks.find((t) => t.id?.toString() === clickInfo.event.id);
    if (task) {
      setSelectedTask(task);
      setDialogOpen(true);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedTask(null);
    setDefaultStart(dayjs(selectInfo.start));
    setDialogOpen(true);
  };

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    const taskId = Number(dropInfo.event.id);
    const updated = {
      startDate: dropInfo.event.start?.toISOString() || null,
      endDate: dropInfo.event.end?.toISOString() || null,
    };
    try {
      await updateTask(taskId, updated);
      fetchTasks();
    } catch (err) {
      console.error("[TabCalendar] Failed to update task via drag/drop", err);
    }
  };

  const handleEventResize = async (resizeInfo: EventResizeDoneArg) => {
    const taskId = Number(resizeInfo.event.id);
    const updated = {
      startDate: resizeInfo.event.start?.toISOString() || null,
      endDate: resizeInfo.event.end?.toISOString() || null,
    };
    try {
      await updateTask(taskId, updated);
      fetchTasks();
    } catch (err) {
      console.error("[TabCalendar] Failed to update task via resize", err);
    }
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
      console.error("[TabCalendar] Failed to save task from dialog", err);
    }
  };

  const handleDialogDelete = async (task: Task) => {
    try {
      if (task.id) {
        await deleteTask(task.id);
        fetchTasks();
      }
    } catch (err) {
      console.error("[TabCalendar] Failed to delete task from dialog", err);
    }
  };

  const eventContent = (eventInfo: any) => {
    const task = tasks.find((t) => t.id?.toString() === eventInfo.event.id);
    if (!task) return <div>{eventInfo.event.title}</div>;

    const today = dayjs().startOf("day");
    const dueDate = task.dueDate ? dayjs(task.dueDate) : null;

    let bgColor = groupColors.Later;
    let textColor = "#000";

    if (task.status === "Done") {
      bgColor = groupColors.Completed;
      textColor = "#777";
    } else if (
      (task.status === "Todo" || task.status === "In Progress") &&
      dueDate &&
      dueDate.isBefore(today)
    ) {
      bgColor = groupColors.Overdue;
    }

    return (
      <div
        style={{
          backgroundColor: bgColor,
          borderRadius: "14px",
          padding: "2px 6px",
          fontSize: "0.85rem",
          color: textColor,
        }}
      >
        {eventInfo.event.title}
      </div>
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
      {!loading && (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          selectable
          selectMirror
          editable
          droppable
          events={tasks
            .filter((t) => t && t.id)
            .map((t) => ({
              id: t.id!.toString(),
              title: t.name || "(Untitled)",
              start: t.startDate || t.dueDate,
              end: t.endDate,
            }))}
          eventContent={eventContent}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
        />
      )}
      <TaskDialog
        open={dialogOpen}
        task={selectedTask}
        onClose={() => setDialogOpen(false)}
        onSave={handleDialogSave}
        onDelete={handleDialogDelete}
        defaultStart={defaultStart}
      />
    </Paper>
  );
};

export default TabCalendar;