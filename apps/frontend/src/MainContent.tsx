import React, { useEffect, useState } from "react";
import TasksTab from "./components/TasksTab";
import ProjectsTab from "./components/ProjectsTab";
import HabitsTab from "./components/HabitsTab";
import RewardsTab from "./components/RewardsTab";

const API_URL = import.meta.env.VITE_API_URL || "/db";

export default function MainContent() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [projects, setProjects] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);

  useEffect(() => {
    // Fetch projects
    fetch(`${API_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql: "SELECT * FROM projects", params: [] }),
    })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("[MainContent] Failed to fetch projects", err));

    // Fetch habits
    fetch(`${API_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql: "SELECT * FROM habits", params: [] }),
    })
      .then((res) => res.json())
      .then((data) => setHabits(data))
      .catch((err) => console.error("[MainContent] Failed to fetch habits", err));
  }, []);

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setActiveTab("tasks")} className={activeTab === "tasks" ? "font-bold" : ""}>
          Tasks
        </button>
        <button onClick={() => setActiveTab("projects")} className={activeTab === "projects" ? "font-bold" : ""}>
          Projects
        </button>
        <button onClick={() => setActiveTab("habits")} className={activeTab === "habits" ? "font-bold" : ""}>
          Habits
        </button>
        <button onClick={() => setActiveTab("rewards")} className={activeTab === "rewards" ? "font-bold" : ""}>
          Rewards
        </button>
      </div>

      {activeTab === "tasks" && <TasksTab />}
      {activeTab === "projects" && <ProjectsTab projects={projects} />}
      {activeTab === "habits" && <HabitsTab habits={habits} />}
      {activeTab === "rewards" && <RewardsTab />}
    </div>
  );
}