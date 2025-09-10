import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTaskStore } from "../store/useTaskStore";
import TaskDialog from "./TaskDialog";
import { updateTask, createTask } from "../api/tasks";

function toISO(ddmmyyyy: string): string {
  if (!ddmmyyyy || ddmmyyyy.length !== 8) return "";
  return `${ddmmyyyy.slice(4, 8)}-${ddmmyyyy.slice(2, 4)}-${ddmmyyyy.slice(0, 2)}`;
}

const CalendarView: React.FC = () => {
  const { tasks, setTasks } = useTaskStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const events = tasks.map((t) => ({
    id: String(t.id),
    title: t.name,
    start: t.start_date ? t.start_date : toISO(t.due_date),
    end: t.end_date ? t.end_date : toISO(t.due_date),
    allDay: true,
  }));

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setDialogOpen(true);
  };

  const handleEventDrop = async (info: any) => {
    const { id, start, end } = info.event;
    try {
      const updated = await updateTask(id, {
        due_date: start.toISOString().slice(0, 10),
        start_date: start.toISOString().slice(0, 10),
        end_date: end ? end.toISOString().slice(0, 10) : start.toISOString().slice(0, 10),
      });
      setTasks(tasks.map((t) => (String(t.id) === id ? updated : t)));
    } catch (err) {
      console.error("[Calendar] Failed to update task", err);
    }
  };

  const handleCreateTask = async (task: any) => {
    try {
      const newTask = await createTask({
        ...task,
        due_date: selectedDate || new Date().toISOString().slice(0, 10),
      });
      setTasks([...tasks, newTask]);
    } catch (err) {
      console.error("[Calendar] Failed to create task", err);
    }
    setDialogOpen(false);
  };

  return (
    <div className="bg-white shadow rounded-2xl p-4">
      <h2 className="text-purple-600 font-semibold mb-3">Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
        events={events}
        editable={true}
        selectable={true}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventDrop}
        height="auto"
      />
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleCreateTask}
      />
    </div>
  );
};

export default CalendarView;
