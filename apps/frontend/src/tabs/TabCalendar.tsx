import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@mui/material";

// ✅ Fixed import for FullCalendar v6
import "@fullcalendar/daygrid/index.css";

export default function TabCalendar() {
  return (
    <Box p={2}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[]}
        height="auto"
      />
    </Box>
  );
}
