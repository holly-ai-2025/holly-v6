import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Paper } from "@mui/material";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";

interface TaskEvent {
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
        Object.values(data).forEach((arr: any) => {
          (arr as any[]).forEach((task) => {
            if (task.due_date) {
              evts.push({ title: task.name, date: task.due_date });
            }
          });
        });
        setEvents(evts);
      });
  }, []);

  return (
    <Box p={2}>
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden", p: 2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
          dayMaxEventRows={3}
        />
      </Paper>
      <style>
        {`
          .fc { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          .fc-toolbar-title { font-size: 1.2rem; font-weight: 600; color: #333; }
          .fc-daygrid-day { border: none !important; padding: 6px !important; }
          .fc-daygrid-day-frame { border-radius: 10px; transition: background 0.2s; }
          .fc-daygrid-day-frame:hover { background: #f5f5f5; }
          .fc-event { border-radius: 8px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.1); background: #1976d2 !important; color: white !important; padding: 2px 6px; font-size: 0.8rem; }
        `}
      </style>
    </Box>
  );
}