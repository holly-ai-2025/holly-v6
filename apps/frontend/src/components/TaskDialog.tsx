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
  Checkbox,
  FormControlLabel,
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
  const [endDate, setEndDate] = useState(task?.endDate || "");
  const [priority, setPriority] = useState(task?.priority || "Medium");
  const [rewardTokens, setRewardTokens] = useState(task?.tokenValue || 5);
  const [effort, setEffort] = useState(task?.effortLevel || "Medium");
  const [status, setStatus] = useState(task?.status || "todo");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [urgencyScore, setUrgencyScore] = useState(task?.urgencyScore || 5);
  const [archived, setArchived] = useState(task?.archived || false);
  const [pinned, setPinned] = useState(task?.pinned || false);

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

  const handleSave = async () => {
    const payload = {
      name: title,
      description,
      startDate: startDate || null,
      endDate: endDate || null,
      dueDate: dueDate || null,
      priority,
      tokenValue: rewardTokens,
      effortLevel: effort,
      urgencyScore,
      status,
      boardId: board || null,
      phaseId: phase || null,
      category,
      archived,
      pinned,
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

        {/* Date Fields */}
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
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
          <TextField
            label="Due Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
          />
        </div>

        {/* Urgency */}
        <div style={{ marginTop: "10px" }}>
          <div style={{ marginBottom: 4 }}>Urgency Score</div>
          <CompactSlider
            value={urgencyScore}
            onChange={(_, val) => setUrgencyScore(val as number)}
            min={1}
            max={10}
            step={1}
          />
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
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 2 }} />

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