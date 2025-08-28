import React, { useState } from "react";
import { Box, Tabs, Tab, Divider, TextField } from "@mui/material";
import TabDashboard from "./tabs/TabDashboard";
import TabTasks from "./tabs/TabTasks";
import TabProjects from "./tabs/TabProjects";
import TabHabits from "./tabs/TabHabits";
import TabCalendar from "./tabs/TabCalendar";
import TabRewards from "./tabs/TabRewards";

export default function MainContent() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header with Tabs and Search */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab label="Dashboard" />
          <Tab label="Tasks" />
          <Tab label="Projects" />
          <Tab label="Habits" />
          <Tab label="Calendar" />
          <Tab label="Rewards" />
        </Tabs>
        <TextField size="small" placeholder="Search..." variant="outlined" />
      </Box>

      {/* Divider below header */}
      <Divider />

      {/* Tab Content */}
      <Box sx={{ flex: 1, p: 2 }}>
        {activeTab === 0 && <TabDashboard />}
        {activeTab === 1 && <TabTasks />}
        {activeTab === 2 && <TabProjects />}
        {activeTab === 3 && <TabHabits />}
        {activeTab === 4 && <TabCalendar />}
        {activeTab === 5 && <TabRewards />}
      </Box>
    </Box>
  );
}