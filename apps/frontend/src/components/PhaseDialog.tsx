import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Phase } from "../api/phases";

interface PhaseDialogProps {
  open: boolean;
  phase: Phase | null;
  onClose: () => void;
  onSave: (form: Partial<Phase>) => void;
  projectId: number;
}

const PhaseDialog: React.FC<PhaseDialogProps> = ({ open, phase, onClose, onSave, projectId }) => {
  const [form, setForm] = useState<Partial<Phase>>({ projectId });

  useEffect(() => {
    if (phase) {
      setForm({ ...phase });
    } else {
      setForm({ projectId });
    }
  }, [phase, projectId]);

  const handleChange = (field: keyof Phase, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      onSave(form);
      onClose();
    } catch (err) {
      console.error("[PhaseDialog] Failed to save phase", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{phase ? "Edit Phase" : "New Phase"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <DatePicker
              label="Deadline"
              value={form.deadline ? dayjs(form.deadline) : null}
              onChange={(date) => handleChange("deadline", date ? date.toISOString() : null)}
              slotProps={{ textField: { fullWidth: true, size: "small" } }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhaseDialog;