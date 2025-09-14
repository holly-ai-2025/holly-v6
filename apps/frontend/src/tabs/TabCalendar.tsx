import React, { useState, useEffect, useCallback } from "react";
import FullCalendar, {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventResizeDoneArg,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Button, Typography, Tooltip } from "@mui/material";
import { DateCalendar, TimePicker } from "@mui/x-date-pickers";
import TaskDialog from "../components/TaskDialog";
import { Task, getTasks, updateTask } from "../api/tasks";
import "../styles/CalendarStyles.css";
import dayjs from "dayjs";

const TabCalendar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // ... fetchTasks, handlers unchanged ...

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Calendar</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedTask(null); setDialogOpen(true); }}>
          + New Task
        </Button>
      </Box>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
        events={tasks.map((t) => ({
          id: t.id.toString(),
          title: t.name,
          start: t.startDate || t.dueDate,
          end: t.endDate,
          classNames: [t.status === "Todo" ? "event-todo" : t.status === "In Progress" ? "event-inprogress" : t.status === "Done" ? "event-completed" : "event-pinned"],
        }))}
        selectable
        select={(info) => setSelectedTask({
          id: 0,
          name: "",
          dueDate: info.startStr,
          startDate: info.startStr,
          endDate: info.endStr || undefined,
          status: "Todo",
          priority: "Medium",
        } as Task)}
        eventClick={(info) => {
          const task = tasks.find((t) => t.id === Number(info.event.id));
          if (task) setSelectedTask(task);
          setDialogOpen(true);
        }}
        eventDrop={async (dropInfo: EventDropArg) => {
          const task = tasks.find((t) => t.id === Number(dropInfo.event.id));
          if (task) {
            await updateTask(task.id, {
              startDate: dropInfo.event.start?.toISOString(),
              endDate: dropInfo.event.end?.toISOString(),
              dueDate: dropInfo.event.start?.toISOString().split("T")[0],
            });
            setTasks(await getTasks());
          }
        }}
        eventResize={async (resizeInfo: EventResizeDoneArg) => {
          const task = tasks.find((t) => t.id === Number(resizeInfo.event.id));
          if (task) {
            await updateTask(task.id, {
              startDate: resizeInfo.event.start?.toISOString(),
              endDate: resizeInfo.event.end?.toISOString(),
            });
            setTasks(await getTasks());
          }
        }}
        editable
        height="auto"
      />

      {/* Date/Time controls for selected task */}
      {selectedTask && (
        <Box mt={2}>
          <Tooltip title={`Due: ${selectedTask.dueDate || "Not set"}`} arrow>
            <span>
              <DateCalendar
                value={selectedTask.dueDate ? dayjs(selectedTask.dueDate) : null}
                onChange={(newDate) => updateTask(selectedTask.id, { dueDate: newDate?.format("YYYY-MM-DD") })}
              />
            </span>
          </Tooltip>
          <TimePicker
            label="Start"
            value={selectedTask.startDate ? dayjs(selectedTask.startDate) : null}
            onChange={(newTime) => updateTask(selectedTask.id, { startDate: newTime?.toISOString() })}
          />
          <TimePicker
            label="End"
            value={selectedTask.endDate ? dayjs(selectedTask.endDate) : null}
            onChange={(newTime) => updateTask(selectedTask.id, { endDate: newTime?.toISOString() })}
          />
        </Box>
      )}

      {dialogOpen && (
        <TaskDialog open={dialogOpen} task={selectedTask} onClose={() => setDialogOpen(false)} onSave={async () => setTasks(await getTasks())} />
      )}
    </Box>
  );
};

export default TabCalendar;