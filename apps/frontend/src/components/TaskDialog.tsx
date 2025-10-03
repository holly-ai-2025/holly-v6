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
import { getBoards } from "../api/boards";
import { getPhases } from "../api/phases";

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
  onTaskAdded: (payload: any) => void;
  onDelete?: (task: any) => void;
  task?: any;
  boardId?: number;
  phaseId?: number;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, onClose, onTaskAdded, onDelete, task, boardId, phaseId }) => {
  const isNew = !task;

  const [title, setTitle] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.due_date || "");
  const [priority, setPriority] = useState(task?.priority ? ["Low", "Medium", "High", "Urgent"].indexOf(task.priority) + 1 : 2);
  const [rewardTokens, setRewardTokens] = useState(task?.token_value || 5);
  const [effort, setEffort] = useState(task?.effort_level ? ["Low", "Medium", "High"].indexOf(task.effort_level) + 1 : 2);
  const [status, setStatus] = useState(task?.status || "Todo");
  const [archived, setArchived] = useState(task?.archived || false);
  const [pinned, setPinned] = useState(task?.pinned || false);
  const [notes, setNotes] = useState(task?.notes || "");

  const [boards, setBoards] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [board, setBoard] = useState<number | "">(task?.board_id || boardId || "");
  const [phase, setPhase] = useState<number | "">(task?.phase_id || phaseId || "");
  const [category, setCategory] = useState(task?.category || "");

  useEffect(() => {
    getBoards().then(setBoards);
  }, []);

  useEffect(() => {
    if (board) {
      // If boardId is provided, fetch phases directly from backend with filtering
      getPhases(typeof board === "number" ? board : undefined).then((fetched) => {
        setPhases(fetched);
      });
    } else {
      // Fallback: fetch all phases if no board selected
      getPhases().then(setPhases);
    }
  }, [board]);

  useEffect(() => {
    if (task) {
      setTitle(task.name || "");
      setDescription(task.description || "");
      setDueDate(task.due_date || "");
      setPriority(task.priority ? ["Low", "Medium", "High", "Urgent"].indexOf(task.priority) + 1 : 2);
      setRewardTokens(task.token_value || 5);
      setEffort(task.effort_level ? ["Low", "Medium", "High"].indexOf(task.effort_level) + 1 : 2);
      setStatus(task.status || "Todo");
      setArchived(task.archived || false);
      setPinned(task.pinned || false);
      setBoard(task.board_id || boardId || "");
      setPhase(task.phase_id || phaseId || "");
      setCategory(task.category || "");
      setNotes(task.notes || "");
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority(2);
      setRewardTokens(5);
      setEffort(2);
      setStatus("Todo");
      setArchived(false);
      setPinned(false);
      setBoard(boardId || "");
      setPhase(phaseId || "");
      setCategory("");
      setNotes("");
    }
  }, [task, open, boardId, phaseId]);

  const handleSave = () => {
    const priorityMap = ["Low", "Medium", "High", "Urgent"];
    const effortMap = ["Low", "Medium", "High"];
    const statusMap: Record<string, string> = {
      todo: "Todo",
      inprogress: "In Progress",
      done: "Done",
      Todo: "Todo",
      "In Progress": "In Progress",
      Done: "Done",
    };

    const payload = {
      name: title,
      description,
      due_date: dueDate || null,
      priority: priorityMap[priority - 1],
      token_value: rewardTokens,
      effort_level: effortMap[effort - 1],
      status: statusMap[status] || "Todo",
      board_id: board || null,
      phase_id: phase || null,
      category,
      archived,
      pinned,
      notes,
    };

    onTaskAdded(payload);
    onClose();
  };

  const handleDelete = () => {
    if (!isNew && onDelete) onDelete(task);
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
        </div>

        <Divider sx={{ my: 2 }} />

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

        <Accordion sx={{ bgcolor: "#f5f5f5", color: "#000", borderRadius: 1, mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#000" }} />}>Connections</AccordionSummary>
          <AccordionDetails sx={{ bgcolor: "#fff" }}>
            <Select
              fullWidth
              value={board}
              onChange={(e) => setBoard(Number(e.target.value))}
              displayEmpty
              size="small"
              sx={inputSx}
            >
              <MenuItem value="" disabled>
                Select a board
              </MenuItem>
              {boards.map((b) => (
                <MenuItem key={b.board_id} value={b.board_id}>{b.name}</MenuItem>
              ))}
            </Select>
            <Select
              fullWidth
              value={phase}
              onChange={(e) => setPhase(Number(e.target.value))}
              displayEmpty
              disabled={!board}
              size="small"
              sx={{ mt: 2, ...inputSx }}
            >
              <MenuItem value="" disabled>
                Select a phase
              </MenuItem>
              {phases.map((p) => (
                <MenuItem key={p.id || p.phase_id} value={p.id || p.phase_id}>{p.name}</MenuItem>
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

        <Accordion sx={{ bgcolor: "#f5f5f5", color: "#000", borderRadius: 1, mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#000" }} />}>Notes</AccordionSummary>
          <AccordionDetails sx={{ bgcolor: "#fff" }}>
            <ReactQuill theme="snow" value={notes} onChange={setNotes} />
          </AccordionDetails>
        </Accordion>

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
          <ToggleButton value="Todo">Todo</ToggleButton>
          <ToggleButton value="In Progress">In Progress</ToggleButton>
          <ToggleButton value="Done">Done</ToggleButton>
        </ToggleButtonGroup>

        <div>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          {!isNew && onDelete && (
            <Button onClick={handleDelete} color="error" sx={{ mr: 1 }}>Delete</Button>
          )}
          <Button onClick={handleSave} variant="contained">Save</Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;