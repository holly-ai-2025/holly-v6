import { useState } from "react";
import { Box, Typography, MenuItem, Select } from "@mui/material";
import {
  FlowboardTab,
  TaskListTab,
  BoardsTab,
  CalendarTab,
} from "./index";

const VIEWS = {
  "Flowboard": <FlowboardTab />,
  "Task List": <TaskListTab />,
  "Boards": <BoardsTab />,
  "Calendar": <CalendarTab />,
};

const TabWorkspace = () => {
  const [view, setView] = useState<keyof typeof VIEWS>("Flowboard");

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Select value={view} onChange={(e) => setView(e.target.value as keyof typeof VIEWS)}>
          {Object.keys(VIEWS).map((key) => (
            <MenuItem key={key} value={key}>{key}</MenuItem>
          ))}
        </Select>
        <Typography variant="h6">Workspace</Typography>
      </Box>
      <Box mt={2}>{VIEWS[view]}</Box>
    </Box>
  );
};

export default TabWorkspace;