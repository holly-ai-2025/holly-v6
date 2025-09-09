import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "../theme";
import TabTasks from "../tabs/TabTasks";

// Fake container for mounting test component
const container = document.createElement("div");
document.body.appendChild(container);

// Provide mock data environment variables
;(import.meta as any).env = {
  VITE_API_URL: "http://localhost:8000",
  VITE_OPS_TOKEN: "test-token",
};

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TabTasks />
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);