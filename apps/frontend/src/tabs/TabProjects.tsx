import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, LinearProgress, Box } from "@mui/material";

interface Project {
  project_id: string;
  name: string;
  status?: string;
  progress?: number;
}

export default function TabProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/db/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}`,
      },
      body: JSON.stringify({ sql: "SELECT * FROM projects" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const rows = data.rows.map((row: any) => ({
            project_id: row[0],
            name: row[1],
            status: row[2],
            progress: row[3],
          }));
          setProjects(rows);
        }
      });
  }, []);

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {projects.map((proj) => (
          <Grid item xs={12} md={6} lg={4} key={proj.project_id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{proj.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {proj.status}
                </Typography>
                <Box mt={2}>
                  <LinearProgress
                    variant="determinate"
                    value={proj.progress || 0}
                  />
                  <Typography variant="caption">{proj.progress || 0}%</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}