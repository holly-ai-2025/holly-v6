import React from "react";
import { useTaskStore } from "../store/useTaskStore";

const getBackgroundColor = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = (due.getTime() - today.getTime()) / (1000 * 3600 * 24);

  if (diff < 0) return "bg-red-100"; // overdue
  if (diff < 1) return "bg-purple-100"; // today
  if (diff < 7) return "bg-blue-100"; // within a week
  return "bg-blue-50"; // further away
};

export default function TasksTab() {
  const { tasks, updateTask } = useTaskStore();

  return (
    <div className="p-4 space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`rounded-lg shadow p-4 flex justify-between items-center ${getBackgroundColor(
            task.dueDate
          )}`}
        >
          <div>
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
            <select
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value })}
              className="mt-2 border rounded px-2 py-1 text-sm"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <input
              type="date"
              value={task.dueDate}
              onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
              className="ml-2 border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}