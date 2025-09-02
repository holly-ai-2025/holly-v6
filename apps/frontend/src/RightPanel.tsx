import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function RightPanel() {
  return (
    <Box
      sx={{
        width: 280,
        borderLeft: "1px solid #e0e0e0",
        bgcolor: "#f5f7fa",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        Stats & Achievements
      </Typography>

      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Reward Tokens
        </Typography>
        <Typography variant="h4" color="primary" fontWeight={800}>
          500 🪙
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="subtitle1">Current Streak</Typography>
        <Typography fontWeight={600}>7 days 🔥</Typography>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="subtitle1">Level</Typography>
        <Typography fontWeight={600}>Explorer — Level 3 ⭐</Typography>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="subtitle1">XP</Typography>
        <Typography fontWeight={600}>1450 / 2000</Typography>
      </Paper>
    </Box>
  );
}