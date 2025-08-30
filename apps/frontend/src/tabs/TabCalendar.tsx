import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/calendar.css"; // custom Apple-inspired styling

export default function TabCalendar() {
  return (
    <div style={{ padding: "1rem" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        events={[]}
      />
    </div>
  );
}
