import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/system";
import { createTask, updateTask, deleteTask } from "../api/tasks";
import { getBoards } from "../api/boards";
import { getPhases } from "../api/phases";

// Styled sliders
const CompactSlider = styled(Slider)({
  height: 6,
  padding: "4px 0",
  "& .MuiSlider-thumb": { width: 18, height: 18 },
});

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: any;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, onClose, task }) => {
  const isNew = !task;

  const [title, setTitle] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [startDate, setStartDate] = useState(task?.startDate || "");
  const [startTime, setStartTime] = useState(task?.startTime || "");
  const [endTime, setEndTime] = useState(task?.endTime || "");
  const [priority, setPriority] = useState(task?.priority || 2);
  const [rewardTokens, setRewardTokens] = useState(task?.tokenValue || 10);
  const [effort, setEffort] = useState(task?.effortLevel || 1);
  const [status, setStatus] = useState(task?.status || "todo");

  const [boards, setBoards] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [board, setBoard] = useState(task?.boardId || "");
  const [phase, setPhase] = useState(task?.phaseId || "");
  const [category, setCategory] = useState(task?.category || "");
  const [tags, setTags] = useState<string[]>(task?.tags || []);

  useEffect(() => {
    getBoards().then(setBoards);
  }, []);

  useEffect(() => {
    if (board) getPhases(board).then(setPhases);
  }, [board]);

  const handleSave = async () => {
    const payload = {
      name: title,
      description,
      startDate: startDate || null,
      startTime: startTime || null,
      endTime: endTime || null,
      priority,
      tokenValue: rewardTokens,
      effortLevel: effort,
      status,
      boardId: board || null,
      phaseId: phase || null,
      category,
      tags,
    };
    if (isNew) await createTask(payload);
    else await updateTask(task.id, payload);
    onClose();
  };

  const handleDelete = async () => {
    if (!isNew) await deleteTask(task.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isNew ? "New Task" : title || "Untitled Task"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="dense"
        />
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="dense"
        />

        <Divider sx={{ my: 2 }} />

        {/* Date & Time */}
        <div style={{ display: "flex", gap: "10px" }}>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
          <TextField
            label="Start Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            fullWidth
          />
          <TextField
            label="End Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            fullWidth
          />
        </div>

        {/* Priority */}
        <div style={{ marginTop: "10px" }}>
          <div style={{ marginBottom: 4 }}>Priority</div>
          <CompactSlider
            value={priority}
            onChange={(_, val) => setPriority(val as number)}
            min={1}
            max={4}
            step={1}
          />
        </div>

        {/* Reward + Effort */}
        <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 4 }}>Reward Tokens</div>
            <CompactSlider
              value={rewardTokens}
              onChange={(_, val) => setRewardTokens(val as number)}
              min={5}
              max={20}
              step={5}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 4 }}>Effort</div>
            <CompactSlider
              value={effort}
              onChange={(_, val) => setEffort(val as number)}
              min={1}
              max={3}
              step={1}
            />
          </div>
        </div>

        <Divider sx={{ my: 2 }} />

        {/* Connections */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Connections</AccordionSummary>
          <AccordionDetails>
            <Select
              fullWidth
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              displayEmpty
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
              sx={{ mt: 2 }}
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
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              placeholder="Add tags..."
              value={tags.join(", ")}
              onChange={(e) => setTags(e.target.value.split(","))}
              margin="dense"
              sx={{ mt: 2 }}
            />
          </AccordionDetails>
        </Accordion>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <ToggleButtonGroup
          value={status}
          exclusive
          onChange={(_, val) => val && setStatus(val)}
          size="small"
        >
          <ToggleButton value="todo" sx={{ color: status === "todo" ? "#2196f3" : "grey" }}>Todo</ToggleButton>
          <ToggleButton value="inprogress" sx={{ color: status === "inprogress" ? "#ff9800" : "grey" }}>In Progress</ToggleButton>
          <ToggleButton value="done" sx={{ color: status === "done" ? "#4caf50" : "grey" }}>Done</ToggleButton>
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