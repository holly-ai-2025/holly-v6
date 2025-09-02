import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface Task {
  id: string;
  name: string;
  due_date?: string;
  status?: string;
  priority?: string;
  project?: string;
  category?: string;
}

type TaskGroups = Record<string, Task[]>;

const TabTasks: React.FC = () => {
  const [tasks, setTasks] = useState<TaskGroups>({
    Overdue: [],
    Today: [],
    Tomorrow: [],
    "This Week": [],
    Later: [],
  });
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Overdue: true,
    Today: true,
    Tomorrow: true,
    "This Week": false,
    Later: false,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/db/tasks`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
          },
        });
        const data: TaskGroups = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };
    fetchTasks();
  }, []);

  const handleToggle = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <Box p={2}>
      {Object.keys(tasks).map((group) => (
        <Box key={group} mb={2}>
          {/* Group header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => handleToggle(group)}
            sx={{
              cursor: "pointer",
              background: "#f0f4f8",
              p: 1.2,
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            <Typography variant="subtitle1">{group}</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">{tasks[group]?.length || 0}</Typography>
              <IconButton size="small">
                {openGroups[group] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>

          {/* Task list */}
          <Collapse in={openGroups[group]}>
            <Box mt={1}>
              {tasks[group]?.map((task) => (
                <Box
                  key={task.id}
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    p: 1,
                    mb: 1,
                    height: "45px",
                    fontSize: "0.9rem",
                  }}
                >
                  <Checkbox size="small" sx={{ borderRadius: "50%" }} />
                  <Typography variant="body2" sx={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {task.name}
                  </Typography>
                  {(group === "This Week" || group === "Later") && task.due_date && (
                    <Typography variant="caption" color="textSecondary">
                      ({task.due_date})
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default TabTasks;