import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { createPhase } from "../api/phases";

interface PhaseDialogProps {
  open: boolean;
  onClose: () => void;
  boardId: number;
  onPhaseAdded: () => void;
}

const PhaseDialog: React.FC<PhaseDialogProps> = ({ open, onClose, boardId, onPhaseAdded }) => {
  const [name, setName] = useState("");

  const handleSave = async () => {
    try {
      await createPhase({
        name,
        boardId, // ✅ fixed key
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