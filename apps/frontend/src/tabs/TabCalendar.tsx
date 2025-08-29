import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@mui/material";

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
    <Box p={2}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="80vh"
      />
    </Box>
  );
}