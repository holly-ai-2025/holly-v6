import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import { tasks } from "./data/tasks";

export default function CalendarView() {
  const events = tasks.map((task) => ({
    title: task.title,
    date: task.dueDate,
  }));

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