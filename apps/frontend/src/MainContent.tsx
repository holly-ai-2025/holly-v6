import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import TabDashboard from "./tabs/TabDashboard";
import TabProjects from "./tabs/TabProjects";
import TabHabits from "./tabs/TabHabits";
import TabSettings from "./tabs/TabSettings";

export default function MainContent() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header + Search will remain here */}
      <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
        <Tab label="Dashboard" />
        <Tab label="Projects" />
        <Tab label="Habits" />
        <Tab label="Settings" />
      </Tabs>

      <Box sx={{ flex: 1, p: 2 }}>
        {activeTab === 0 && <TabDashboard />}
        {activeTab === 1 && <TabProjects />}
        {activeTab === 2 && <TabHabits />}
        {activeTab === 3 && <TabSettings />}
      </Box>
    </Box>
  );
}