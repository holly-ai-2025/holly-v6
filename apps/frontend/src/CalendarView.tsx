import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "@fullcalendar/daygrid/main.css"; // ✅ use main.css
import "./styles/calendar.css"; // custom Apple-inspired styling
import { allTasks } from "./data/tasks";

export default function CalendarView() {
  const events = allTasks.map((task) => ({ title: task.title, date: task.due }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Calendar
      </Typography>
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
        />
      </Paper>
    </Box>
  );
}