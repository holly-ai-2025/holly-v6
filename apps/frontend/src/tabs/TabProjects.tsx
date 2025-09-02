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
    fetch(`${import.meta.env.VITE_API_URL}/db/projects`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_OPS_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {projects.map((proj, index) => (
          <Box
            key={proj.project_id || `project-${index}`}
            sx={{ width: { xs: "100%", md: "50%", lg: "33.33%" } }}
          >
            <Card sx={{ borderRadius: 3, boxShadow: 3, m: 1 }}>
              <CardContent>
                <Typography variant="h6">{proj.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {proj.status}
                </Typography>
                <Box mt={2}>
                  <LinearProgress
                    variant="determinate"
                    value={proj.progress ? Number(proj.progress) : 0}
                  />
                  <Typography variant="caption">{proj.progress || 0}%</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}