import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Tooltip } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getTasks, Task } from "../api/tasks";

const TabCalendar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("[TabCalendar] Failed to fetch tasks", err);
    }
  };

  return (
    <Box p={2}>
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Calendar
        </Typography>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
          events={tasks
            .filter((t) => t && t.id)
            .map((t) => ({
              id: t.id.toString(),
              title: t.name || "(Untitled)",
              start: t.startDate || t.dueDate,
              end: t.endDate,
              extendedProps: { status: t.status },
            }))}
          eventContent={(eventInfo) => (
            <Tooltip title={eventInfo.event.title} arrow>
              <span>{eventInfo.event.title}</span>
            </Tooltip>
          )}
        />
      </Paper>
    </Box>
  );
};

export default TabCalendar;