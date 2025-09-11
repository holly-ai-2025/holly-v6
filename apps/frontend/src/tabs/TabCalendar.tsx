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

const allowedPatchFields = new Set([
  "status",
  "priority",
  "due_date",
  "start_date",
  "end_date",
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

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      if (Array.isArray(data)) {
        setTasks(
          data.filter(
            (v, i, a) => a.findIndex((t) => t.task_id === v.task_id) === i
          )
        );
      }
    } catch (err) {
      console.error("[TabCalendar] Failed to fetch tasks", err);
    }
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
        } else if (key === "start_date" || key === "end_date") {
          payload[key] = dayjs(value).format("YYYY-MM-DDTHH:mm:ss");
        } else {
          payload[key] = value;
        }
      }
    });
    return payload;
  };

  const handleEventClick = (clickInfo: any) => {
    const task = tasks.find((t) => String(t.task_id) === clickInfo.event.id);
    if (task) {
      setSelectedTask(task);
      setIsNewTask(false);
      setDialogOpen(true);
    }
  };

  const handleEventDrop = async (dropInfo: any) => {
    const taskId = parseInt(dropInfo.event.id, 10);
    const newStart = dropInfo.event.start;
    const newEnd = dropInfo.event.end;
    if (taskId && newStart) {
      await updateTask(taskId, buildPayload({
        start_date: dayjs(newStart).format("YYYY-MM-DDTHH:mm:ss"),
        end_date: newEnd
          ? dayjs(newEnd).format("YYYY-MM-DDTHH:mm:ss")
          : dayjs(newStart).add(1, "hour").format("YYYY-MM-DDTHH:mm:ss"),
        due_date: dayjs(newStart).format("YYYY-MM-DD"),
      }));
      fetchTasks();
    }
  };

  const handleEventResize = async (resizeInfo: any) => {
    const taskId = parseInt(resizeInfo.event.id, 10);
    const newStart = resizeInfo.event.start;
    const newEnd = resizeInfo.event.end;
    if (taskId && newStart && newEnd) {
      await updateTask(taskId, buildPayload({
        start_date: dayjs(newStart).format("YYYY-MM-DDTHH:mm:ss"),
        end_date: dayjs(newEnd).format("YYYY-MM-DDTHH:mm:ss"),
        due_date: dayjs(newStart).format("YYYY-MM-DD"),
      }));
      fetchTasks();
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    setIsNewTask(true);
    setSelectedTask({
      task_name: "",
      description: "",
      due_date: dayjs(selectInfo.start).format("YYYY-MM-DD"),
      start_date: dayjs(selectInfo.start).format("YYYY-MM-DDTHH:mm:ss"),
      end_date: selectInfo.end
        ? dayjs(selectInfo.end).format("YYYY-MM-DDTHH:mm:ss")
        : dayjs(selectInfo.start).add(1, "hour").format("YYYY-MM-DDTHH:mm:ss"),
      status: "Todo",
    } as Task);
    setDialogOpen(true);
    selectInfo.view.calendar.unselect();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
    setIsNewTask(false);
    fetchTasks();
  };

  const handleDialogSave = async (updates: Partial<Task>) => {
    if (isNewTask) {
      try {
        const payload = buildPayload(updates, true);
        await createTask(payload);
      } catch (err) {
        console.error("[TabCalendar] Failed to create task", err);
      }
    } else if (selectedTask?.task_id) {
      try {
        await updateTask(selectedTask.task_id, buildPayload(updates));
      } catch (err) {
        console.error("[TabCalendar] Failed to update task", err);
      }
    }
    handleDialogClose();
  };

  const events = tasks
    .filter((t) => t.due_date || t.start_date)
    .sort((a, b) => {
      const aTime = a.start_date ? dayjs(a.start_date).valueOf() : 0;
      const bTime = b.start_date ? dayjs(b.start_date).valueOf() : 0;
      return aTime - bTime;
    })
    .map((t) => {
      if (t.start_date && t.end_date) {
        return {
          id: String(t.task_id),
          title: t.task_name || "Untitled",
          start: t.start_date,
          end: t.end_date,
          allDay: false,
          extendedProps: { status: t.status, description: t.description },
        };
      } else {
        return {
          id: String(t.task_id),
          title: t.task_name || "Untitled",
          start: t.due_date || undefined,
          allDay: true,
          extendedProps: { status: t.status, description: t.description },
        };
      }
    });

  const eventClassNames = (arg: any) => {
    const status = arg.event.extendedProps.status;
    if (status === "Done") return ["event-completed"];
    if (status === "In Progress") return ["event-inprogress"];
    if (status === "Pinned") return ["event-pinned"];
    return ["event-todo"];
  };

  const eventContent = (arg: any) => {
    const { title, start, end } = arg.event;
    const timeRange = start && end ? `${dayjs(start).format("HH:mm")} – ${dayjs(end).format("HH:mm")}` : "";
    return (
      <Tooltip title={<><b>{title}</b>{timeRange && <><br />{timeRange}</>}<br />{arg.event.extendedProps.description || "No description"}</>} arrow>
        <span>{title}{timeRange ? ` ${timeRange}` : ""}</span>
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
            <Button variant="contained" onClick={() => {
              setIsNewTask(true);
              setSelectedTask({ task_name: "", description: "", due_date: null, start_date: null, end_date: null, status: "Todo" } as Task);
              setDialogOpen(true);
            }}>
              + New Task
            </Button>
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
            select={handleDateSelect}
            slotMinTime="06:00:00"
            events={events}
            datesSet={updateTitle}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
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