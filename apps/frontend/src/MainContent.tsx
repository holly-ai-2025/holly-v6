import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  Stack,
  Divider,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RedeemIcon from "@mui/icons-material/Redeem";

import { allTasks, Task } from "./data/tasks";
import { projects } from "./data/projects";
import { habits } from "./data/habits";
import { rewards as initialRewards } from "./data/rewards";
import CalendarView from "./CalendarView";

export default function MainContent({ activeTab }: { activeTab: string }) {
  const [tab, setTab] = useState(0);
  const [rewards, setRewards] = useState(initialRewards);
  const [newReward, setNewReward] = useState({ name: "", cost: 0 });
  const [tokens, setTokens] = useState(500);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const claimReward = (index: number) => {
    const reward = rewards[index];
    if (tokens >= reward.cost) {
      setTokens(tokens - reward.cost);
      setRewards(rewards.filter((_, i) => i !== index));
    }
  };

  const deleteReward = (index: number) => {
    setRewards(rewards.filter((_, i) => i !== index));
  };

  const addReward = () => {
    if (newReward.name && newReward.cost > 0) {
      setRewards([...rewards, newReward]);
      setNewReward({ name: "", cost: 0 });
    }
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Paper sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, borderRadius: 0, borderBottom: "1px solid #e0e0e0" }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Dashboard" />
          <Tab label="Tasks" />
          <Tab label="Projects" />
          <Tab label="Habits" />
          <Tab label="Calendar" />
          <Tab label="Rewards" />
        </Tabs>
        <TextField placeholder="Search…" size="small" sx={{ width: 240 }} />
      </Paper>

      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {tab === 0 && (
          <Typography>Welcome to Holly AI Dashboard. Choose a tab to get started.</Typography>
        )}

        {tab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Tasks</Typography>
            <List>
              {allTasks.slice(0, 30).map((task: Task) => (
                <ListItem key={task.id} divider>
                  <ListItemText primary={task.title} secondary={`${task.status} — Due: ${task.due}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Projects</Typography>
            {projects.map((project) => (
              <Paper key={project.id} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>{project.name}</Typography>
                {project.phases.map((phase) => (
                  <Box key={phase.id} sx={{ ml: 2, mt: 1 }}>
                    <Typography variant="body1" fontWeight={500}>{phase.name}</Typography>
                    <List dense>
                      {phase.tasks.map((task) => (
                        <ListItem key={task.id}>
                          <ListItemText primary={task.title} secondary={`${task.status} — Due: ${task.due}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </Paper>
            ))}
          </Box>
        )}

        {tab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>Habits</Typography>
            <Divider sx={{ mb: 2 }} />
            {Object.entries(habits).map(([frequency, list]) => (
              <Box key={frequency} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600}>{frequency.toUpperCase()}</Typography>
                <List dense>
                  {list.map((habit) => (
                    <ListItem key={habit.id}>
                      <ListItemText primary={habit.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        )}

        {tab === 4 && <CalendarView />}

        {tab === 5 && (
          <Box>
            <Typography variant="h6" gutterBottom>Rewards</Typography>
            <Typography variant="subtitle1" color="primary" fontWeight={600} sx={{ mb: 2 }}>You have {tokens} Tokens</Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <TextField label="Reward Name" size="small" value={newReward.name} onChange={(e) => setNewReward({ ...newReward, name: e.target.value })} />
              <TextField label="Cost (tokens)" size="small" type="number" value={newReward.cost} onChange={(e) => setNewReward({ ...newReward, cost: parseInt(e.target.value) })} />
              <Button variant="contained" onClick={addReward}>Add Reward</Button>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {rewards.map((reward, idx) => (
                <Paper key={idx} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography>{reward.name} — {reward.cost} Tokens</Typography>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" color="success" size="small" startIcon={<RedeemIcon />} onClick={() => claimReward(idx)}>Claim</Button>
                    <IconButton color="error" onClick={() => deleteReward(idx)}><DeleteIcon /></IconButton>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}