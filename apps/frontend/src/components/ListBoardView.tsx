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
import { getGroups, createGroup, Group } from "../api/groups";
import { getItems, createItem, Item } from "../api/items";
import { getTasks, createTask, Task } from "../api/tasks";
import { Board } from "../api/boards";

interface ListBoardViewProps {
  board: Board;
}

const ListBoardView: React.FC<ListBoardViewProps> = ({ board }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newItemTitle, setNewItemTitle] = useState("");

  useEffect(() => {
    fetchGroups();
    fetchItems();
    fetchTasks();
  }, [board.id]);

  const fetchGroups = async () => {
    try {
      const data = await getGroups();
      setGroups(data.filter((g: Group) => g.boardId === board.id));
    } catch (err) {
      console.error("[ListBoardView] Failed to fetch groups", err);
    }
  };

  const fetchItems = async () => {
    try {
      const data = await getItems();
      setItems(data.filter((i: Item) => i.boardId === board.id));
    } catch (err) {
      console.error("[ListBoardView] Failed to fetch items", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data.filter((t: Task) => t.boardId === board.id));
    } catch (err) {
      console.error("[ListBoardView] Failed to fetch tasks", err);
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupName) return;
    try {
      await createGroup({ boardId: board.id, name: newGroupName });
      setNewGroupName("");
      fetchGroups();
    } catch (err) {
      console.error("[ListBoardView] Failed to create group", err);
    }
  };

  const handleAddTask = async (groupId?: number) => {
    if (!newTaskName) return;
    try {
      await createTask({
        boardId: board.id,
        groupId: groupId || null,
        name: newTaskName,
      });
      setNewTaskName("");
      fetchTasks();
    } catch (err) {
      console.error("[ListBoardView] Failed to create task", err);
    }
  };

  const handleAddItem = async (groupId?: number) => {
    if (!newItemTitle) return;
    try {
      await createItem({
        boardId: board.id,
        groupId: groupId || null,
        name: newItemTitle,
      });
      setNewItemTitle("");
      fetchItems();
    } catch (err) {
      console.error("[ListBoardView] Failed to create item", err);
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
        <Accordion key={group.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{group.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Add Task */}
            <Box display="flex" gap={2} mb={2}>
              <TextField
                size="small"
                label="New Task"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />
              <Tooltip title="Add a task" arrow>
                <span>
                  <Button variant="contained" onClick={() => handleAddTask(group.id)}>Add Task</Button>
                </span>
              </Tooltip>
            </Box>

            {/* Add Item */}
            <Box display="flex" gap={2} mb={2}>
              <TextField
                size="small"
                label="New Item"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
              />
              <Tooltip title="Add an item" arrow>
                <span>
                  <Button variant="contained" onClick={() => handleAddItem(group.id)}>Add Item</Button>
                </span>
              </Tooltip>
            </Box>

            {/* Tasks */}
            <Grid container spacing={1}>
              {tasks.filter((t) => t.groupId === group.id).map((task) => (
                <Grid item xs={12} key={task.id}>
                  <Paper sx={{ p: 1, borderRadius: 2 }}>
                    <Typography>📝 {task.name}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Items */}
            <Grid container spacing={1}>
              {items.filter((i) => i.groupId === group.id).map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Paper sx={{ p: 1, borderRadius: 2 }}>
                    <Typography>📌 {item.name}</Typography>
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