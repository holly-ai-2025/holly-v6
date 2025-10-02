import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getGroups, createGroup, getTasks, createTask } from "../lib/api";

interface Board {
  board_id: number;
  name: string;
  board_type: "project" | "list";
  description?: string;
  color?: string;
}

interface Group {
  group_id: number;
  board_id: number;
  name: string;
  archived?: boolean;
}

interface Task {
  task_id: number;
  board_id: number;
  group_id?: number;
  title: string;
  archived?: boolean;
}

interface ListBoardViewProps {
  board: Board;
  onBoardDeleted?: () => void;
}

const ListBoardView: React.FC<ListBoardViewProps> = ({ board }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetchGroups();
    fetchTasks();
  }, [board.board_id]);

  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      setGroups(res.data.filter((g: Group) => g.board_id === board.board_id && !g.archived));
    } catch (err) {
      console.error("[ListBoardView] Failed to fetch groups", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await getTasks(board.board_id);
      setTasks(res.data.filter((t: Task) => t.board_id === board.board_id && !t.archived));
    } catch (err) {
      console.error("[ListBoardView] Failed to fetch tasks", err);
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupName) return;
    try {
      await createGroup({ board_id: board.board_id, name: newGroupName });
      setNewGroupName("");
      fetchGroups();
    } catch (err) {
      console.error("[ListBoardView] Failed to create group", err);
    }
  };

  const handleAddTask = async (groupId?: number) => {
    if (!newTaskTitle) return;
    try {
      await createTask({
        board_id: board.board_id,
        group_id: groupId || null,
        title: newTaskTitle,
      });
      setNewTaskTitle("");
      fetchTasks();
    } catch (err) {
      console.error("[ListBoardView] Failed to create task", err);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Box sx={{ height: 8, backgroundColor: board.color || "#ccc", borderRadius: 2, mb: 2 }} />
        <Typography variant="h5" fontWeight="bold">{board.name}</Typography>
        <Typography variant="body2" color="text.secondary">{board.description}</Typography>
      </Paper>

      {/* Add Group */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          size="small"
          label="New Group"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddGroup}>Add Group</Button>
      </Box>

      {/* Groups */}
      {groups.map((group) => (
        <Accordion key={group.group_id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{group.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Add Task */}
            <Box display="flex" gap={2} mb={2}>
              <TextField
                size="small"
                label="New Task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <Tooltip title="Add a task" arrow>
                <span>
                  <Button variant="contained" onClick={() => handleAddTask(group.group_id)}>Add Task</Button>
                </span>
              </Tooltip>
            </Box>

            {/* Tasks */}
            <Grid container spacing={1}>
              {tasks.filter((t) => t.group_id === group.group_id).map((task) => (
                <Grid item xs={12} key={task.task_id}>
                  <Paper sx={{ p: 1, borderRadius: 2 }}>
                    <Typography>📝 {task.title}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ListBoardView;