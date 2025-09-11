import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Button, ButtonGroup, Typography, Stack, Card, Tooltip } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import TaskDialog from "../components/TaskDialog";
import { getTasks, createTask, updateTask } from "../api/tasks";
import "../styles/CalendarStyles.css";

// ... existing interfaces and helpers remain unchanged

export default function TabCalendar() {
  // ... existing state and logic remains unchanged

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* ... calendar UI code unchanged */}

      <TaskDialog
        open={dialogOpen}
        task={selectedTask || undefined}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        externalSave={true} // ✅ prevent TaskDialog from writing to DB
      />
    </Box>
  );
}