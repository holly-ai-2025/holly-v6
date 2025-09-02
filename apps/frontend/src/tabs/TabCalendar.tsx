import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@mui/material";

// ✅ FullCalendar v6: styles are bundled in plugin imports, no need for separate CSS/JS files

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
