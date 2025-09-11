import React from "react";
import { useTaskStore } from "../store/useTaskStore";
import { updateTask } from "../api/tasks";
import { parseToDate } from "../utils/taskUtils";

export default function TasksTab() {
  const { tasks, setTasks } = useTaskStore();

  const handleUpdate = async (id: string, updates: Partial<any>) => {
    try {
      const updated = await updateTask(id, updates);
      setTasks(tasks.map((t) => (t.task_id === id ? updated : t)));
    } catch (err) {
      console.error("[TasksTab] Failed to update task", err);
    }
  };

  const today = new Date();
  const overdue = tasks.filter((t) => {
    const d = parseToDate(t.due_date);
    return d && d < today;
  });
  const todayTasks = tasks.filter((t) => {
    const d = parseToDate(t.due_date);
    return d && d.toDateString() === today.toDateString();
  });
  const later = tasks.filter((t) => {
    const d = parseToDate(t.due_date);
    return d && d > today;
  });

  return (
    <div className="space-y-6">
      {overdue.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Overdue</h3>
          {overdue.map((task) => (
            <div key={task.task_id} className="bg-red-100 p-2 rounded-md">
              {task.task_name} – {task.due_date}
            </div>
          ))}
        </div>
      )}
      {todayTasks.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Today</h3>
          {todayTasks.map((task) => (
            <div key={task.task_id} className="bg-green-100 p-2 rounded-md">
              {task.task_name} – {task.due_date}
            </div>
          ))}
        </div>
      )}
      {later.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Later</h3>
          {later.map((task) => (
            <div key={task.task_id} className="bg-blue-100 p-2 rounded-md">
              {task.task_name} – {task.due_date}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}