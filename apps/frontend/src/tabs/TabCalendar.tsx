import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Button, ButtonGroup, Typography, Stack, Card } from "@mui/material";
import { useRef, useState } from "react";
import "../styles/CalendarStyles.css";

export default function TabCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [title, setTitle] = useState("");

  const updateTitle = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      setTitle(api.view.title);
    }
  };

  const handleViewChange = (view: string) => {
    const api = calendarRef.current?.getApi();
    api?.changeView(view);
    setCurrentView(view);
    updateTitle();
  };

  const handleToday = () => {
    calendarRef.current?.getApi().today();
    updateTitle();
  };

  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
    updateTitle();
  };

  const handleNext = () => {
    calendarRef.current?.getApi().next();
    updateTitle();
  };

  return (
    <Box p={3}>
      <Card sx={{ borderRadius: 4, boxShadow: 2, p: 2 }}>
        {/* Custom Toolbar */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Stack direction="row" spacing={2}>
            <ButtonGroup variant="outlined">
              <Button
                onClick={() => handleViewChange("timeGridDay")}
                variant={currentView === "timeGridDay" ? "contained" : "outlined"}
              >
                Day
              </Button>
              <Button
                onClick={() => handleViewChange("timeGridWeek")}
                variant={currentView === "timeGridWeek" ? "contained" : "outlined"}
              >
                Week
              </Button>
              <Button
                onClick={() => handleViewChange("dayGridMonth")}
                variant={currentView === "dayGridMonth" ? "contained" : "outlined"}
              >
                Month
              </Button>
            </ButtonGroup>
            <Button onClick={handleToday}>Today</Button>
            <Button onClick={handlePrev}>{"<"}</Button>
            <Button onClick={handleNext}>{">"}</Button>
          </Stack>
        </Stack>

        {/* FullCalendar */}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          contentHeight="auto"
          nowIndicator={true}
          editable={true}
          droppable={true}
          slotMinTime="06:00:00"
          events={[]}
          datesSet={updateTitle}
        />
      </Card>
    </Box>
  );
}