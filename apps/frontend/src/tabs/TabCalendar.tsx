import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Button, ButtonGroup, Typography, Stack, Card, Tooltip } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import TaskDialog from "../components/TaskDialog";
import "../styles/CalendarStyles.css";

interface Task {
  task_id?: number;
  task_name?: string;
  description?: string;
  due_date?: string | null;
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

const allowedPatchFields = new Set([
  "status",
  "priority",
  "due_date",
  "project_id",
  "phase_id",
  "notes",
  "description",
  "token_value",
  "urgency_score",
  "effort_level",
  "category",
  "task_name",
]);

const allowedPostFields = new Set([...Array.from(allowedPatchFields)]);

const toBackendStatus = (status?: string) => {
  if (!status) return "Todo";
  const s = status.toLowerCase();
  if (s === "done") return "Done";
  if (s === "in progress" || s === "in_progress") return "In Progress";
  if (s === "pinned") return "Pinned";
  return "Todo";
};

export default function TabCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);
  const [defaultDate, setDefaultDate] = useState<string | null>(null);

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

  const fetchTasks = () => {
    fetch(`${import.meta.env.VITE_API_URL}/db/tasks`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch((err) => console.error("[TabCalendar] Failed to fetch tasks", err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const buildPayload = (updates: Partial<Task>, isNew = false): Record<string, any> => {
    const allowed = isNew ? allowedPostFields : allowedPatchFields;
    const payload: Record<string, any> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (allowed.has(key) && value !== null && value !== "") {
        if (key === "status") {
          payload[key] = toBackendStatus(value as string);
        } else if (key === "due_date") {
          payload[key] = dayjs(value).format("YYYY-MM-DD");
        } else {
          payload[key] = value;
        }
      }
    });
    return payload;
  };

  const updateTask = async (taskId: number | undefined, updates: Partial<Task>) => {
    if (!taskId) return;
    const payload = buildPayload(updates);
    if (Object.keys(payload).length === 0) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/db/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update task");
      fetchTasks();
    } catch (err) {
      console.error("[TabCalendar] Failed to update task", err);
    }
  };

  const createTask = async (newTask: Partial<Task>) => {
    const payload = buildPayload(newTask, true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/db/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create task");
      fetchTasks();
    } catch (err) {
      console.error("[TabCalendar] Failed to create task", err);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const task = tasks.find((t) => String(t.task_id) === clickInfo.event.id);
    if (task) {
      setSelectedTask(task);
      setIsNewTask(false);
      setDialogOpen(true);
    }
  };

  const handleEventDrop = (dropInfo: any) => {
    const taskId = parseInt(dropInfo.event.id, 10);
    const newDate = dropInfo.event.start;
    if (taskId && newDate) {
      updateTask(taskId, { due_date: newDate.toISOString() });
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    setIsNewTask(true);
    setDefaultDate(selectInfo.startStr);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
    setIsNewTask(false);
    setDefaultDate(null);
  };

  const handleDialogSave = async (updates: Partial<Task>) => {
    if (isNewTask) {
      const taskWithDate = { ...updates, due_date: updates.due_date || defaultDate };
      await createTask(taskWithDate);
    } else if (selectedTask && selectedTask.task_id) {
      await updateTask(selectedTask.task_id, updates);
    }
    handleDialogClose();
  };

  const events = tasks
    .filter((t) => t.due_date)
    .map((t) => ({
      id: String(t.task_id),
      title: t.task_name || "Untitled",
      start: t.due_date || undefined,
      allDay: true,
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
    const { title, extendedProps } = arg.event;
    const description = extendedProps.description || "No description";
    const dueDate = arg.event.start ? dayjs(arg.event.start).format("MMM D, YYYY") : "";
    return (
      <Tooltip title={<><b>{title}</b><br />{description}<br />Due: {dueDate}</>} arrow>
        <span>{title}</span>
      </Tooltip>
    );
  };

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 2,
          p: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "calc(90vh - 64px)",
        }}
      >
        {/* Custom Toolbar */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
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
            <Button variant="contained" onClick={() => { setIsNewTask(true); setDialogOpen(true); }}>
              + New Task
            </Button>
          </Stack>
        </Stack>

        {/* FullCalendar */}
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
            select={handleDateSelect}
            slotMinTime="06:00:00"
            events={events}
            datesSet={updateTitle}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventClassNames={eventClassNames}
            eventContent={eventContent}
          />
        </Box>
      </Card>

      <TaskDialog
        open={dialogOpen}
        task={isNewTask ? { due_date: defaultDate || undefined } as Task : selectedTask}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
      />
    </Box>
  );
}