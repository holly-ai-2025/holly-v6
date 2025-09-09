import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import TabFlowboard from "./workspace/TabFlowboard";
import TabTasks from "./TabTasks";
import TabProjects from "./TabProjects";
import TabCalendar from "./TabCalendar";

export default function TabWorkspace() {
  const [activeSubTab, setActiveSubTab] = useState(0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Submenu Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
        <Tabs
          value={activeSubTab}
          onChange={(_, val) => setActiveSubTab(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Flowboard" />
          <Tab label="Tasks" />
          <Tab label="Boards" />
          <Tab label="Calendar" />
        </Tabs>
      </Box>

      {/* Submenu Content */}
      <Box sx={{ flex: 1, p: 2 }}>
        {activeSubTab === 0 && <TabFlowboard />}
        {activeSubTab === 1 && <TabTasks />}
        {activeSubTab === 2 && <TabProjects />}
        {activeSubTab === 3 && <TabCalendar />}
      </Box>
    </Box>
  );
}