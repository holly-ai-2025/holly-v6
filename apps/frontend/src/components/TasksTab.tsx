import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

export default function TasksTab() {
  const { groupedTasks, fetchTasks, updateTask } = useTaskStore();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([group, tasks]) => (
        <div key={group} className="space-y-2">
          <div
            className="flex items-center space-x-2 font-semibold text-lg cursor-pointer"
            onClick={() => toggleGroup(group)}
          >
            <span>{group}</span>
            <span className="ml-2 text-gray-500">{openGroups[group] ? "▾" : "▸"}</span>
          </div>
          {openGroups[group] && (
            <div className="space-y-1">
              {tasks.map((task) => (
                <div
                  key={task.task_id}
                  className="flex items-center justify-between px-3 py-2 rounded-md shadow-sm bg-white"
                >
                  <span>{task.task_name}</span>
                  <div className="flex items-center space-x-2">
                    <select
                      value={task.status}
                      onChange={(e) => updateTask(task.task_id, { status: e.target.value })}
                      className="border rounded px-1 py-0.5 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Complete">Complete</option>
                    </select>
                    <input
                      type="date"
                      value={task.due_date || ""}
                      onChange={(e) => updateTask(task.task_id, { due_date: e.target.value })}
                      className="border rounded px-1 py-0.5 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}