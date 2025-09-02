import React, { useState } from "react";
import { Box, Tabs, Tab, TextField } from "@mui/material";
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
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Dashboard" sx={{ color: activeTab === 0 ? "primary.main" : "#333", fontWeight: 500 }} />
          <Tab label="Tasks" sx={{ color: activeTab === 1 ? "primary.main" : "#333", fontWeight: 500 }} />
          <Tab label="Projects" sx={{ color: activeTab === 2 ? "primary.main" : "#333", fontWeight: 500 }} />
          <Tab label="Habits" sx={{ color: activeTab === 3 ? "primary.main" : "#333", fontWeight: 500 }} />
          <Tab label="Calendar" sx={{ color: activeTab === 4 ? "primary.main" : "#333", fontWeight: 500 }} />
          <Tab label="Rewards" sx={{ color: activeTab === 5 ? "primary.main" : "#333", fontWeight: 500 }} />
        </Tabs>
        <TextField size="small" placeholder="Search..." variant="outlined" />
      </Box>

      {/* Custom Divider below header */}
      <Box sx={{ height: "3px", bgcolor: "#d0d8e0", mx: 2 }} />

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