import React from "react";
import CalendarView from "./CalendarView";
import { useTaskStore } from "../store/useTaskStore";

export default function CalendarTab() {
  const { tasks } = useTaskStore();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Calendar</h2>
      <CalendarView />
      <div className="mt-4 space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="p-2 rounded bg-gray-100 shadow-sm">
            <span className="font-medium">{task.name}</span>
            {task.due_date && (
              <span className="ml-2 text-sm text-gray-500">
                Due: {task.due_date}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
