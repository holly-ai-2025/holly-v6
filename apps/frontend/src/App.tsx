import React from "react";
import { Box } from "@mui/material";
import MainContent from "./MainContent";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" flexDirection="column" height="100vh">
        <MainContent />
      </Box>
    </LocalizationProvider>
  );
}

export default App;