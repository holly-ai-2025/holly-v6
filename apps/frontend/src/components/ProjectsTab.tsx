import React from "react";

export default function ProjectsTab({ projects = [] }: { projects?: any[] }) {
  return (
    <div>
      <h2>Projects</h2>
      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        <ul>
          {projects.map((p, i) => (
            <li key={i}>{p.project_name || "Unnamed Project"}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
