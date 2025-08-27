// App shell
import React, { useState } from "react";
import { Box } from "@mui/material";
import LeftPanel from "./components/LeftPanel";
import MainContent from "./MainContent";
import RightPanel from "./RightPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Left Sidebar */}
      <LeftPanel />

      {/* Main Content */}
      <MainContent activeTab={activeTab} />

      {/* Right Sidebar */}
      <RightPanel />
    </Box>
  );
}
