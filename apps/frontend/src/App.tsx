import React from "react";
import { Box } from "@mui/material";
import MainContent from "./MainContent";
import RightPanel from "./RightPanel";
import LeftPanel from "./components/LeftPanel";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" flexDirection="row" height="100dvh">
        <LeftPanel />
        <MainContent />
        <RightPanel />
      </Box>
    </LocalizationProvider>
  );
}

export default App;