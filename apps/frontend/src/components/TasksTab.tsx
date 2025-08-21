import React from "react";
import { useTaskStore } from "../store/useTaskStore";

export default function TasksTab() {
  const { groupedTasks, updateTask } = useTaskStore();

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([group, tasks]) => (
        <div key={group} className="space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-lg">
            <span>{group}</span>
            <button className="ml-2 text-gray-500">▾</button>
          </div>
          <div className="space-y-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between px-3 py-2 rounded-md shadow-sm ${
                  task.color || "bg-white"
                }`}
              >
                <span>{task.title}</span>
                <div className="flex items-center space-x-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTask(task.id, { status: e.target.value })}
                    className="border rounded px-1 py-0.5 text-sm"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  <input
                    type="date"
                    value={task.due}
                    onChange={(e) => updateTask(task.id, { due: e.target.value })}
                    className="border rounded px-1 py-0.5 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}