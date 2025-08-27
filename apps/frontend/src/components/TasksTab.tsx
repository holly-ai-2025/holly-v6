import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTaskStore } from "../store/useTaskStore";

export default function TasksTab() {
  const { groupedTasks, fetchTasks } = useTaskStore();
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  if (!groupedTasks || Object.keys(groupedTasks).length === 0) {
    return <Typography>No tasks found</Typography>;
  }

  return (
    <div style={{ width: "100%", maxWidth: "100%" }}>
      {Object.entries(groupedTasks).map(([group, tasks]) => (
        <Accordion
          key={group}
          expanded={expanded === group}
          onChange={handleChange(group)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{group}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List sx={{ width: "100%" }}>
              {tasks.map((t) => (
                <ListItem key={t.task_id} divider>
                  <ListItemText
                    primary={t.task_name}
                    secondary={`${t.status || "Pending"} — Due: ${
                      t.due_date || "N/A"
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}