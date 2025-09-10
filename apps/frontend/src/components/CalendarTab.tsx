import React from "react";
import { useTaskStore } from "../store/useTaskStore";

export default function CalendarTab() {
  const { tasks } = useTaskStore();

  return (
    <div>
      <h2 className="text-purple-600 font-semibold mb-3">Calendar Tab</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.task_id}>{task.task_name} – {task.due_date}</li>
        ))}
      </ul>
    </div>
  );
}