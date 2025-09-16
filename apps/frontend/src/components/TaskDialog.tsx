import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/system";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createTask, updateTask, deleteTask } from "../api/tasks";
import { getBoards } from "../api/boards";
import { getPhases } from "../api/phases";

// Styled sliders with updated red→blue gradients
const ColoredSlider = styled(Slider)<{ sliderType: string }>(({ sliderType }) => ({
  height: 6,
  borderRadius: 4,
  padding: "6px 0",
  "& .MuiSlider-thumb": {
    width: 18,
    height: 18,
  },
  "& .MuiSlider-track": {
    border: "none",
  },
  ...(sliderType === "priority" && {
    "& .MuiSlider-track": {
      background: "linear-gradient(90deg, #FE433C, #F31D64, #A224AD)",
    },
  }),
  ...(sliderType === "effort" && {
    "& .MuiSlider-track": {
      background: "linear-gradient(90deg, #A224AD, #6A38B3, #3C50B1)",
    },
  }),
  ...(sliderType === "tokens" && {
    "& .MuiSlider-track": {
      background: "linear-gradient(90deg, #3C50B1, #0095EF)",
    },
  }),
}));

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: any;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, onClose, task }) => {
  const isNew = !task;

  const [title, setTitle] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [startTime, setStartTime] = useState(task?.startDate ? task.startDate.split("T")[1]?.slice(0,5) : "");
  const [endTime, setEndTime] = useState(task?.endDate ? task.endDate.split("T")[1]?.slice(0,5) : "");
  const [priority, setPriority] = useState(task?.priority ? ["Low", "Medium", "High", "Urgent"].indexOf(task.priority) + 1 : 2);
  const [rewardTokens, setRewardTokens] = useState(task?.tokenValue || 5);
  const [effort, setEffort] = useState(task?.effortLevel ? ["Low", "Medium", "High"].indexOf(task.effortLevel) + 1 : 2);
  const [status, setStatus] = useState(task?.status || "todo");
  const [archived, setArchived] = useState(task?.archived || false);
  const [pinned, setPinned] = useState(task?.pinned || false);
  const [notes, setNotes] = useState(task?.notes || "");

  const [boards, setBoards] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [board, setBoard] = useState(task?.boardId || "");
  const [phase, setPhase] = useState(task?.phaseId || "");
  const [category, setCategory] = useState(task?.category || "");

  useEffect(() => {
    getBoards().then(setBoards);
  }, []);

  useEffect(() => {
    if (board) getPhases(board).then(setPhases);
  }, [board]);

  useEffect(() => {
    if (task) {
      setTitle(task.name || "");
      setDescription(task.description || "");
      setDueDate(task.dueDate || "");
      setStartTime(task.startDate ? task.startDate.split("T")[1]?.slice(0,5) : "");
      setEndTime(task.endDate ? task.endDate.split("T")[1]?.slice(0,5) : "");
      setPriority(task.priority ? ["Low", "Medium", "High", "Urgent"].indexOf(task.priority) + 1 : 2);
      setRewardTokens(task.tokenValue || 5);
      setEffort(task.effortLevel ? ["Low", "Medium", "High"].indexOf(task.effortLevel) + 1 : 2);
      setStatus(task.status || "todo");
      setArchived(task.archived || false);
      setPinned(task.pinned || false);
      setBoard(task.boardId || "");
      setPhase(task.phaseId || "");
      setCategory(task.category || "");
      setNotes(task.notes || "");
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setStartTime("");
      setEndTime("");
      setPriority(2);
      setRewardTokens(5);
      setEffort(2);
      setStatus("todo");
      setArchived(false);
      setPinned(false);
      setBoard("");
      setPhase("");
      setCategory("");
      setNotes("");
    }
  }, [task, open]);

  const handleStartTimeChange = (val: string) => {
    setStartTime(val);
    if (val) {
      const [h, m] = val.split(":").map(Number);
      const end = new Date();
      end.setHours(h, m + 60);
      setEndTime(end.toTimeString().slice(0, 5));
    } else {
      setEndTime("");
    }
  };

  const handleSave = async () => {
    const priorityMap = ["Low", "Medium", "High", "Urgent"];
    const effortMap = ["Low", "Medium", "High"];

    let startDateTime: string | null = null;
    let endDateTime: string | null = null;

    if (dueDate && startTime) {
      startDateTime = new Date(`${dueDate}T${startTime}`).toISOString();
      if (endTime) {
        endDateTime = new Date(`${dueDate}T${endTime}`).toISOString();
      }
    }

    const payload = {
      name: title,
      description,
      dueDate: dueDate || null,
      startDate: startDateTime,
      endDate: endDateTime,
      priority: priorityMap[priority - 1],
      tokenValue: rewardTokens,
      effortLevel: effortMap[effort - 1],
      urgencyScore: 5,
      status,
      boardId: board || null,
      phaseId: phase || null,
      category,
      archived,
      pinned,
      notes,
    };

    if (isNew) await createTask(payload);
    else await updateTask(task.task_id || task.id, payload);
    onClose();
  };

  const handleDelete = async () => {
    if (!isNew) await deleteTask(task.task_id || task.id);
    onClose();
  };

  const inputSx = { "& .MuiInputBase-root": { height: 42 } };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <TextField
          fullWidth
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="dense"
          size="small"
          sx={inputSx}
        />
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="dense"
          size="small"
          sx={inputSx}
        />

        <Divider sx={{ my: 2 }} />

        {/* Date + Time Fields */}
        <div style={{ display: "flex", gap: "10px" }}>
          <TextField
            label="Due Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
            size="small"
            sx={inputSx}
          />
          <TextField
            label="Start Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            disabled={!dueDate}
            fullWidth
            size="small"
            sx={inputSx}
          />
          <TextField
            label="End Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={!startTime}
            fullWidth
            size="small"
            sx={inputSx}
          />
        </div>

        <Divider sx={{ my: 2 }} />

        {/* Priority Slider */}
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Priority</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ColoredSlider
            sliderType="priority"
            value={priority}
            onChange={(_, val) => setPriority(val as number)}
            min={1}
            max={4}
            step={1}
            sx={{ flex: 1, mr: 2 }}
          />
          <Typography sx={{ width: 30, textAlign: "center" }}>{priority}</Typography>
        </Box>

        {/* Reward Tokens */}
        <Typography variant="body2" sx={{ fontWeight: 500, mt: 1, mb: 1 }}>Reward Tokens</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ColoredSlider
            sliderType="tokens"
            value={rewardTokens}
            onChange={(_, val) => setRewardTokens(val as number)}
            min={5}
            max={20}
            step={5}
            sx={{ flex: 1, mr: 2 }}
          />
          <Typography sx={{ width: 30, textAlign: "center" }}>{rewardTokens}</Typography>
        </Box>

        {/* Effort Slider */}
        <Typography variant="body2" sx={{ fontWeight: 500, mt: 1, mb: 1 }}>Effort</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ColoredSlider
            sliderType="effort"
            value={effort}
            onChange={(_, val) => setEffort(val as number)}
            min={1}
            max={3}
            step={1}
            sx={{ flex: 1, mr: 2 }}
          />
          <Typography sx={{ width: 30, textAlign: "center" }}>{effort}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Connections */}
        <Accordion sx={{ bgcolor: "#f5f5f5", color: "#000", borderRadius: 1, mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#000" }} />}>Connections</AccordionSummary>
          <AccordionDetails sx={{ bgcolor: "#fff" }}>
            <Select
              fullWidth
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              displayEmpty
              size="small"
              sx={inputSx}
            >
              <MenuItem value="" disabled>
                Select a board
              </MenuItem>
              {boards.map((b) => (
                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
              ))}
            </Select>
            <Select
              fullWidth
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              displayEmpty
              disabled={!board}
              size="small"
              sx={{ mt: 2, ...inputSx }}
            >
              <MenuItem value="" disabled>
                Select a phase
              </MenuItem>
              {phases.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
            <TextField
              fullWidth
              placeholder="Select category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              margin="dense"
              size="small"
              sx={{ mt: 2, ...inputSx }}
            />
          </AccordionDetails>
        </Accordion>

        {/* Notes */}
        <Accordion sx={{ bgcolor: "#f5f5f5", color: "#000", borderRadius: 1, mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#000" }} />}>Notes</AccordionSummary>
          <AccordionDetails sx={{ bgcolor: "#fff" }}>
            <ReactQuill theme="snow" value={notes} onChange={setNotes} />
          </AccordionDetails>
        </Accordion>

        {/* Flags */}
        <FormControlLabel
          control={<Checkbox checked={archived} onChange={(e) => setArchived(e.target.checked)} />}
          label="Archived"
        />
        <FormControlLabel
          control={<Checkbox checked={pinned} onChange={(e) => setPinned(e.target.checked)} />}
          label="Pinned"
        />
      </DialogContent>

      <Divider />

      <DialogActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <ToggleButtonGroup
          value={status}
          exclusive
          onChange={(_, val) => val && setStatus(val)}
          size="small"
        >
          <ToggleButton
            value="todo"
            sx={{
              "&.Mui-selected": { bgcolor: "#2196f3", color: "#fff" },
              "&.Mui-selected:hover": { bgcolor: "#1976d2" },
            }}
          >
            Todo
          </ToggleButton>
          <ToggleButton
            value="inprogress"
            sx={{
              "&.Mui-selected": { bgcolor: "#ff9800", color: "#fff" },
              "&.Mui-selected:hover": { bgcolor: "#e68900" },
            }}
          >
            In Progress
          </ToggleButton>
          <ToggleButton
            value="done"
            sx={{
              "&.Mui-selected": { bgcolor: "#4caf50", color: "#fff" },
              "&.Mui-selected:hover": { bgcolor: "#3e8e41" },
            }}
          >
            Done
          </ToggleButton>
        </ToggleButtonGroup>

        <div>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          {!isNew && (
            <Button onClick={handleDelete} color="error" sx={{ mr: 1 }}>Delete</Button>
          )}
          <Button onClick={handleSave} variant="contained">Save</Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;