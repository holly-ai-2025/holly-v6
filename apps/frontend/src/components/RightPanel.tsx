import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

const widgets = [
  { title: "Streak", value: "5 days 🔥" },
  { title: "Achievements", value: "Level 2 Explorer" },
  { title: "XP", value: "1200 / 1500" },
];

export default function RightPanel({ open }: { open: boolean }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
      <Typography variant="h6">Achievements & Stats</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {widgets.map((w, idx) => (
          <Grid item xs={12} key={idx}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1">{w.title}</Typography>
              <Typography variant="body2">{w.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}