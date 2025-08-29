import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, LinearProgress, Box } from "@mui/material";

interface Habit {
  habit_id: string;
  habit_name: string;
  frequency?: string;
  streak?: number;
  goal?: string;
  last_completed?: string;
}

export default function TabHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/db/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
      },
      body: JSON.stringify({ sql: "SELECT habit_id, habit_name, frequency, streak, goal, last_completed FROM habits" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const rows = data.rows.map((row: any) => ({
            habit_id: row[0],
            habit_name: row[1],
            frequency: row[2],
            streak: row[3],
            goal: row[4],
            last_completed: row[5],
          }));
          setHabits(rows);
        }
      });
  }, []);

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {habits.map((habit) => (
          <Grid item xs={12} md={6} lg={4} key={habit.habit_id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{habit.habit_name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {habit.frequency}
                </Typography>
                <Box mt={2}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, ((habit.streak || 0) / 30) * 100)}
                  />
                  <Typography variant="caption">
                    Streak: {habit.streak || 0} — Goal: {habit.goal}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}