import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, LinearProgress, Box } from "@mui/material";

interface Habit {
  habit_id: string;
  habit_name: string;
  frequency?: string;
  streak?: number;
  goal?: number;
  last_completed?: string;
}

export default function TabHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/db/habits`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => setHabits(data));
  }, []);

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {habits.map((habit, index) => (
          <Box
            key={habit.habit_id || `habit-${index}`}
            sx={{ width: { xs: "100%", md: "50%", lg: "33.33%" } }}
          >
            <Card sx={{ borderRadius: 3, boxShadow: 3, m: 1 }}>
              <CardContent>
                <Typography variant="h6">{habit.habit_name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {habit.frequency}
                </Typography>
                <Box mt={2}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, ((habit.streak || 0) / (habit.goal || 1)) * 100)}
                  />
                  <Typography variant="caption">
                    Streak: {habit.streak || 0} — Goal: {habit.goal || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}