import React from "react";
import { useTaskStore } from "../store/useTaskStore";
import { updateTask } from "../api/tasks";

function toDate(ddmmyyyy: string): Date | null {
  if (!ddmmyyyy || ddmmyyyy.length !== 8) return null;
  return new Date(`${ddmmyyyy.slice(4, 8)}-${ddmmyyyy.slice(2, 4)}-${ddmmyyyy.slice(0, 2)}`);
}

export default function TasksTab() {
  const { tasks, setTasks } = useTaskStore();

  const handleUpdate = async (id: string, updates: Partial<any>) => {
    try {
      // Always pass ISO here; API layer will normalize
      if (updates.due_date instanceof Date) {
        updates.due_date = updates.due_date.toISOString().slice(0, 10);
      }
      const updated = await updateTask(id, updates);
      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("[TasksTab] Failed to update task", err);
    }
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