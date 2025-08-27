import React, { useState, useEffect } from "react";
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

const API_URL = "https://agent.hollyai.xyz"; // backend API

export default function MainContent() {
  const [tab, setTab] = useState(0);

  // State for DB entities
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [habits, setHabits] = useState<Record<string, any[]>>({});

  // Rewards still local
  const [rewards, setRewards] = useState<{ name: string; cost: number }[]>([
    { name: "Coffee", cost: 100 },
  ]);
  const [newReward, setNewReward] = useState({ name: "", cost: 0 });
  const [tokens, setTokens] = useState(500);

  // Shared fetch helper
  async function dbQuery(sql: string) {
    const res = await fetch(`${API_URL}/db/query`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer holly-local-123", // replace with OPS_TOKEN
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
    });
    return res.json();
  }

  // Load tasks
  useEffect(() => {
    dbQuery("SELECT task_id as id, task_name as title, status, due_date as due FROM tasks LIMIT 30;")
      .then((res) => {
        if (res.ok) setTasks(res.rows.map((r: any) => {
          const obj: any = {};
          res.columns.forEach((col: string, idx: number) => obj[col] = r[idx]);
          return obj;
        }));
      });
  }, []);

  // Load projects + phases + tasks
  useEffect(() => {
    Promise.all([
      dbQuery("SELECT project_id as id, name, status, progress FROM projects;"),
      dbQuery("SELECT phase_id as id, name, project_id FROM phases;"),
      dbQuery("SELECT task_id as id, task_name as title, status, due_date as due, project_id, phase_id FROM tasks;")
    ]).then(([projRes, phaseRes, taskRes]) => {
      if (!projRes.ok || !phaseRes.ok || !taskRes.ok) return;

      const mapRows = (res: any) => res.rows.map((r: any) => {
        const obj: any = {};
        res.columns.forEach((col: string, idx: number) => obj[col] = r[idx]);
        return obj;
      });

      const projects = mapRows(projRes);
      const phases = mapRows(phaseRes);
      const tasks = mapRows(taskRes);

      // attach phases → projects
      projects.forEach((p: any) => {
        p.phases = phases.filter((ph: any) => ph.project_id === p.id);
        p.phases.forEach((ph: any) => {
          ph.tasks = tasks.filter((t: any) => t.phase_id === ph.id);
        });
      });

      setProjects(projects);
    });
  }, []);

  // Load habits
  useEffect(() => {
    dbQuery("SELECT habit_id as id, habit_name as name, frequency FROM habits;")
      .then((res) => {
        if (res.ok) {
          const rows = res.rows.map((r: any) => {
            const obj: any = {};
            res.columns.forEach((col: string, idx: number) => obj[col] = r[idx]);
            return obj;
          });
          const grouped: Record<string, any[]> = {};
          rows.forEach((h) => {
            grouped[h.frequency] = grouped[h.frequency] || [];
            grouped[h.frequency].push(h);
          });
          setHabits(grouped);
        }
      });
  }, []);

  // Reward actions
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
      {/* Header with tabs */}
      <Paper sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, borderRadius: 0, borderBottom: "1px solid #e0e0e0" }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Dashboard" />
          <Tab label="Tasks" />
          <Tab label="Projects" />
          <Tab label="Habits" />
          <Tab label="Calendar" />
          <Tab label="Rewards" />
        </Tabs>
        <TextField placeholder="Search…" size="small" sx={{ width: 240 }} />
      </Paper>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {tab === 0 && <Typography>Welcome to Holly AI Dashboard. Choose a tab to get started.</Typography>}

        {tab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Tasks</Typography>
            <List>
              {tasks.map((task) => (
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
                {project.phases.map((phase: any) => (
                  <Box key={phase.id} sx={{ ml: 2, mt: 1 }}>
                    <Typography variant="body1" fontWeight={500}>{phase.name}</Typography>
                    <List dense>
                      {phase.tasks.map((task: any) => (
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
                  {list.map((habit: any) => (
                    <ListItem key={habit.id}><ListItemText primary={habit.name} /></ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        )}

        {tab === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>Calendar</Typography>
            <Typography>(Calendar component will go here — large format view)</Typography>
          </Box>
        )}

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