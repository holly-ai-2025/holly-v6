import React from "react";
import { useTaskStore } from "../store/useTaskStore";

function toDate(ddmmyyyy: string): Date | null {
  if (!ddmmyyyy || ddmmyyyy.length !== 8) return null;
  return new Date(`${ddmmyyyy.slice(4, 8)}-${ddmmyyyy.slice(2, 4)}-${ddmmyyyy.slice(0, 2)}`);
}

export default function TasksTab() {
  const { tasks, setTasks } = useTaskStore();

  const updateTask = (id: string, updates: Partial<any>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const today = new Date();
  const overdue = tasks.filter((t) => {
    const d = toDate(t.due_date);
    return d && d < today;
  });
  const todayTasks = tasks.filter((t) => {
    const d = toDate(t.due_date);
    return d && d.toDateString() === today.toDateString();
  });

  return (
    <div className="space-y-6">
      {overdue.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Overdue</h3>
          {overdue.map((task) => (
            <div key={task.id} className="bg-red-100 p-2 rounded-md">
              {task.name} – {task.due_date}
            </div>
          ))}
        </div>
      )}
      {todayTasks.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Today</h3>
          {todayTasks.map((task) => (
            <div key={task.id} className="bg-green-100 p-2 rounded-md">
              {task.name} – {task.due_date}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}