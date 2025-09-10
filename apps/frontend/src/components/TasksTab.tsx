import React from "react";
import { useTaskStore } from "../store/useTaskStore";

function toInputDate(ddmmyyyy: string): string {
  if (!ddmmyyyy || ddmmyyyy.length !== 8) return "";
  return `${ddmmyyyy.slice(4, 8)}-${ddmmyyyy.slice(2, 4)}-${ddmmyyyy.slice(0, 2)}`;
}

function toDDMMYYYY(iso: string): string {
  if (!iso || iso.length !== 10) return "";
  const [year, month, day] = iso.split("-");
  return `${day}${month}${year}`;
}

export default function TasksTab() {
  const { tasks, setTasks } = useTaskStore();

  const updateTask = (id: string, updates: Partial<any>) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <div key={task.id} className="space-y-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-md shadow-sm bg-white">
            <span>{task.name}</span>
            <div className="flex items-center space-x-2">
              <select
                value={task.status}
                onChange={(e) =>
                  updateTask(task.id, { status: e.target.value })
                }
                className="border rounded px-1 py-0.5 text-sm"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <input
                type="date"
                value={toInputDate(task.due_date)}
                onChange={(e) =>
                  updateTask(task.id, { due_date: toDDMMYYYY(e.target.value) })
                }
                className="border rounded px-1 py-0.5 text-sm"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}