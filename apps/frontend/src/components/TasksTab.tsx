import React from "react";
import { tasks } from "../data/tasks";
import { groupTasks } from "../utils/groupTasks";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { useTaskStore } from "../store/useTaskStore";

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

export default function TasksTab() {
  const { tasks, toggleTask } = useTaskStore();
  const grouped = groupTasks(tasks);

  return (
    <div className="p-4 overflow-y-auto">
      <Section title="Today">
        {grouped.today.map((task) => (
          <Card key={task.id} className="flex justify-between items-center p-2">
            <span className={task.completed ? "line-through text-gray-400" : ""}>
              {task.title}
            </span>
            <Button onClick={() => toggleTask(task.id)} variant="outline" size="sm">
              {task.completed ? "Undo" : "Done"}
            </Button>
          </Card>
        ))}
      </Section>

      <Section title="Tomorrow">
        {grouped.tomorrow.map((task) => (
          <Card key={task.id} className="flex justify-between items-center p-2">
            <span className={task.completed ? "line-through text-gray-400" : ""}>
              {task.title}
            </span>
            <Button onClick={() => toggleTask(task.id)} variant="outline" size="sm">
              {task.completed ? "Undo" : "Done"}
            </Button>
          </Card>
        ))}
      </Section>

      <Section title="This Week">
        {grouped.thisWeek.map((task) => (
          <Card key={task.id} className="flex justify-between items-center p-2">
            <span className={task.completed ? "line-through text-gray-400" : ""}>
              {task.title}
            </span>
            <Button onClick={() => toggleTask(task.id)} variant="outline" size="sm">
              {task.completed ? "Undo" : "Done"}
            </Button>
          </Card>
        ))}
      </Section>
    </div>
  );
}