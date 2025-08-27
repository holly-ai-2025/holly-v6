import React from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";

export default function MainPanel() {
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">Holly Main Area</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="body1">
          This is the central panel. Content will go here.
        </Typography>
      </Box>
    </Box>
  );
}