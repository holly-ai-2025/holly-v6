import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Paper } from "@mui/material";
import "@fullcalendar/daygrid/index.css";

interface TaskEvent {
  id: string;
  title: string;
  date: string;
}

export default function TabCalendar() {
  const [events, setEvents] = useState<TaskEvent[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const evts: TaskEvent[] = [];
        Object.keys(data).forEach((group) => {
          data[group].forEach((task: any) => {
            if (task.due_date) {
              evts.push({ id: task.id, title: task.name, date: task.due_date });
            }
          });
        });
        setEvents(evts);
      });
  }, []);

  return (
    <Box p={3}>
      <Paper sx={{ p: 2, borderRadius: 4, boxShadow: 3 }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="80vh"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          dayMaxEventRows={3}
        />
      </Paper>
      <style>{`
        .fc { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .fc-toolbar-title { font-size: 1.2rem; font-weight: 600; color: #333; }
        .fc-daygrid-day { border-radius: 12px; padding: 4px; }
        .fc-daygrid-day-frame { border: none !important; }
        .fc-daygrid-day-number { font-size: 0.9rem; font-weight: 500; color: #666; }
        .fc-day-today { background-color: #e3f2fd !important; border-radius: 12px; }
        .fc-event { border-radius: 8px !important; padding: 2px 6px; font-size: 0.8rem; background-color: #4A90E2 !important; color: white !important; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
      `}</style>
    </Box>
  );
}