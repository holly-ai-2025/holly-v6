import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function LeftPanel() {
  return (
    <Box
      sx={{
        width: 320,
        borderRight: "1px solid #e0e0e0",
        bgcolor: "#f0f6fb",
        display: "flex",
        flexDirection: "column",
        p: 2,
        position: "relative",
        boxShadow: "4px 0 8px rgba(0,0,0,0.06)",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "6px",
          height: "100%",
          background: "linear-gradient(to left, rgba(0,0,0,0.06), transparent)",
        },
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Chat with Holly
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          flex: 1,
          mb: 2,
          borderRadius: 2,
          boxShadow: 1,
          overflowY: "auto",
          bgcolor: "#fff",
        }}
      >
        <Typography>
          <b>Holly:</b> Good morning! Ready to plan your day?
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <b>You:</b> Yes, let’s go.
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <b>Holly:</b> Don’t forget to take a break later!
        </Typography>
      </Paper>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <TextField size="small" fullWidth placeholder="Type a message..." />
        <Button variant="contained">Send</Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Recent Actions
      </Typography>
      <List dense>
        {[
          "Marked task 'Finish report' as complete",
          "Scheduled meeting with Alex",
          "Created new habit: Morning Walk",
        ].map((action, idx) => (
          <ListItem
            key={idx}
            secondaryAction={<Button size="small" variant="outlined">UNDO</Button>}
          >
            <ListItemText primary={action} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}