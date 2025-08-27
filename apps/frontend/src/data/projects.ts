export interface Phase {
  id: string;
  name: string;
  tasks: string[]; // task IDs from master list
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  status: "On Track" | "At Risk" | "Ahead";
  phases: Phase[];
}

import { Task } from "./tasks";

// Generate 10 projects × 3 phases × 5 tasks
const generateProjects = (): { projects: Project; projectTasks: Task[] }[] => {
  const statuses = ["On Track", "At Risk", "Ahead"] as const;
  const all: { projects: Project; projectTasks: Task[] }[] = [];

  for (let p = 1; p <= 10; p++) {
    const projectId = `p${p}`;
    const phases: Phase[] = [];
    const projectTasks: Task[] = [];

    for (let ph = 1; ph <= 3; ph++) {
      const phaseId = `p${p}-ph${ph}`;
      const taskIds: string[] = [];

      for (let t = 1; t <= 5; t++) {
        const taskId = `p${p}-ph${ph}-t${t}`;
        taskIds.push(taskId);
        projectTasks.push({
          id: taskId,
          title: `Task ${t} of Phase ${ph} in Project ${p}`,
          status: ["Todo", "In Progress", "Done"][Math.floor(Math.random() * 3)] as
            | "Todo"
            | "In Progress"
            | "Done",
          due: `2025-08-${10 + (t % 20)}`,
          projectId,
          phaseId,
        });
      }

      phases.push({ id: phaseId, name: `Phase ${ph}`, tasks: taskIds });
    }

    all.push({
      projects: {
        id: projectId,
        name: `Project ${p}`,
        progress: Math.floor(Math.random() * 100),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        phases,
      },
      projectTasks,
    });
  }

  return all;
};

const generated = generateProjects();
export const projects: Project[] = generated.map((g) => g.projects);
export const projectTasks: Task[] = generated.flatMap((g) => g.projectTasks);

