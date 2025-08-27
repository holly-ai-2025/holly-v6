import React, { useState } from "react";
import { Box } from "@mui/material";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import MainContent from "./MainContent";

export default function App() {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <LeftPanel />
      <MainContent activeTab={activeTab} sx={{ flex: 1, overflow: "auto" }} />
      <RightPanel />
    </Box>
  );
}