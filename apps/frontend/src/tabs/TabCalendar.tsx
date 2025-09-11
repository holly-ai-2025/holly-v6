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

interface Task {
  task_id?: number;
  task_name?: string;
  description?: string;
  due_date?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string;
  priority?: string;
  category?: string;
  project_id?: number;
  notes?: string;
  token_value?: number;
  urgency_score?: number;
  effort_level?: string;
  board_id?: number;
  created_at?: string;
  updated_at?: string;
}

export default function TabCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);

  const updateTitle = () => {
    const api = calendarRef.current?.getApi();
    if (api) setTitle(api.view.title);
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("[TabCalendar] Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
    setIsNewTask(false);
    fetchTasks();
  };

  const handleDialogSave = async (updates: Partial<Task>) => {
    try {
      if (isNewTask) {
        await createTask(updates);
      } else if (selectedTask?.task_id) {
        await updateTask(selectedTask.task_id, updates);
      }
    } catch (err) {
      console.error("[TabCalendar] Failed to save task", err);
    } finally {
      handleDialogClose();
    }
  };

  const events = tasks.map((t) => ({
    id: String(t.task_id),
    title: t.task_name || "Untitled",
    start: t.start_date || t.due_date || undefined,
    end: t.end_date || undefined,
    allDay: !t.start_date,
    extendedProps: { status: t.status, description: t.description },
  }));

  const eventClassNames = (arg: any) => {
    const status = arg.event.extendedProps.status;
    if (status === "Done") return ["event-completed"];
    if (status === "In Progress") return ["event-inprogress"];
    if (status === "Pinned") return ["event-pinned"];
    return ["event-todo"];
  };

  const eventContent = (arg: any) => {
    const { title } = arg.event;
    return (
      <Tooltip title={<><b>{title}</b><br />{arg.event.extendedProps.description || "No description"}</>} arrow>
        <span>{title}</span>
      </Tooltip>
    );
  };

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Card sx={{ borderRadius: 4, boxShadow: 2, p: 2, flex: 1, display: "flex", flexDirection: "column", height: "calc(90vh - 64px)" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">{title}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <ButtonGroup variant="outlined">
              <Button onClick={() => setCurrentView("timeGridDay")} variant={currentView === "timeGridDay" ? "contained" : "outlined"}>Day</Button>
              <Button onClick={() => setCurrentView("timeGridWeek")} variant={currentView === "timeGridWeek" ? "contained" : "outlined"}>Week</Button>
              <Button onClick={() => setCurrentView("dayGridMonth")} variant={currentView === "dayGridMonth" ? "contained" : "outlined"}>Month</Button>
            </ButtonGroup>
            <Button onClick={() => calendarRef.current?.getApi().today()}>Today</Button>
            <Button onClick={() => calendarRef.current?.getApi().prev()}>{"<"}</Button>
            <Button onClick={() => calendarRef.current?.getApi().next()}>{">"}</Button>
            <Button variant="contained" onClick={() => { setIsNewTask(true); setSelectedTask({ task_name: "", status: "Todo" }); setDialogOpen(true); }}>+ New Task</Button>
          </Stack>
        </Stack>

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="100%"
            contentHeight="100%"
            nowIndicator={true}
            editable={true}
            droppable={true}
            selectable={true}
            selectMirror={true}
            eventResizableFromStart={true}
            events={events}
            datesSet={updateTitle}
            eventClassNames={eventClassNames}
            eventContent={eventContent}
          />
        </Box>
      </Card>

      <TaskDialog
        open={dialogOpen}
        task={selectedTask || undefined}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
      />
    </Box>
  );
}