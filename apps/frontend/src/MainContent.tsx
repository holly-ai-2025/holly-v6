import React, { useState } from "react";
import { Box, Tabs, Tab, TextField } from "@mui/material";
import TabDashboard from "./tabs/TabDashboard";
import TabWorkspace from "./tabs/TabWorkspace";
import TabHabits from "./tabs/TabHabits";
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
          TabIndicatorProps={{ style: { display: "none" } }}
        >
          <Tab label="Dashboard" sx={{ color: activeTab === 0 ? "primary.main" : "#333", fontWeight: activeTab === 0 ? 700 : 500 }} />
          <Tab label="Workspace" sx={{ color: activeTab === 1 ? "primary.main" : "#333", fontWeight: activeTab === 1 ? 700 : 500 }} />
          <Tab label="Habits" sx={{ color: activeTab === 2 ? "primary.main" : "#333", fontWeight: activeTab === 2 ? 700 : 500 }} />
          <Tab label="Rewards" sx={{ color: activeTab === 3 ? "primary.main" : "#333", fontWeight: activeTab === 3 ? 700 : 500 }} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Search..."
          variant="outlined"
          sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
      </Box>

      {/* Custom Divider below header */}
      <Box sx={{ height: "3px", bgcolor: "#a0acb8", mx: 2 }} />

      {/* Tab Content */}
      <Box sx={{ flex: 1, p: 2 }}>
        {activeTab === 0 && <TabDashboard />}
        {activeTab === 1 && <TabWorkspace />}
        {activeTab === 2 && <TabHabits />}
        {activeTab === 3 && <TabRewards />}
      </Box>
    </Box>
  );
}