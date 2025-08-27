import React, { useEffect, useState } from "react";
import TasksTab from "./components/TasksTab";
import ProjectsTab from "./components/ProjectsTab";
import HabitsTab from "./components/HabitsTab";
import RewardsTab from "./components/RewardsTab";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const OPS_TOKEN = import.meta.env.VITE_OPS_TOKEN || "";

export default function MainContent({ activeTab, sx = {} }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);

  useEffect(() => {
    // Fetch projects
    fetch(`${API_URL}/db/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPS_TOKEN}`,
      },
      body: JSON.stringify({ sql: "SELECT * FROM projects", params: [] }),
    })
      .then((res) => res.json())
      .then((data) => setProjects(data.rows || []))
      .catch((err) => console.error("[MainContent] Failed to fetch projects", err));

    // Fetch habits
    fetch(`${API_URL}/db/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPS_TOKEN}`,
      },
      body: JSON.stringify({ sql: "SELECT * FROM habits", params: [] }),
    })
      .then((res) => res.json())
      .then((data) => setHabits(data.rows || []))
      .catch((err) => console.error("[MainContent] Failed to fetch habits", err));
  }, []);

  return (
    <div style={{ flex: 1, width: "100%", ...sx }}>
      <div className="flex space-x-4 mb-4">
        {activeTab === "tasks" && <TasksTab />}
        {activeTab === "projects" && <ProjectsTab projects={projects} />}
        {activeTab === "habits" && <HabitsTab habits={habits} />}
        {activeTab === "rewards" && <RewardsTab />}
      </div>
    </div>
  );
}