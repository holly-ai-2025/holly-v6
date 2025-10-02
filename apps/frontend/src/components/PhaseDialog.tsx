import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import api from "../lib/api";

interface PhaseDialogProps {
  open: boolean;
  onClose: () => void;
  boardId: number;
  onPhaseAdded: () => void;
}

const PhaseDialog: React.FC<PhaseDialogProps> = ({ open, onClose, boardId, onPhaseAdded }) => {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);

  const handleSave = async () => {
    try {
      await api.post("/db/phases", {
        name,
        board_id: boardId,
        deadline: deadline ? deadline.toISOString() : null,
      });
      onPhaseAdded();
      onClose();
    } catch (error) {
      console.error("Failed to add phase", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Phase</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Phase Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Deadline"
            value={deadline}
            onChange={(newValue) => setDeadline(newValue)}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="dense" />
            )}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhaseDialog;