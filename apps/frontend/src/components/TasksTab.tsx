import React from "react";
import { useTaskStore } from "../store/useTaskStore";

const TasksTab: React.FC = () => {
  const { tasks, updateTask } = useTaskStore();

  const groupTasks = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const overdue: any[] = [];
    const todayTasks: any[] = [];
    const tomorrowTasks: any[] = [];
    const upcoming: any[] = [];

    tasks.forEach((task) => {
      if (task.dueDate < today) {
        overdue.push(task);
      } else if (task.dueDate === today) {
        todayTasks.push(task);
      } else if (task.dueDate === tomorrowStr) {
        tomorrowTasks.push(task);
      } else {
        upcoming.push(task);
      }
    });

    return { overdue, todayTasks, tomorrowTasks, upcoming };
  };

  const { overdue, todayTasks, tomorrowTasks, upcoming } = groupTasks();

  const getBgColor = (dueDate: string) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    if (dueDate < today) return "bg-red-100";
    if (dueDate === today) return "bg-purple-100";
    if (dueDate === tomorrowStr) return "bg-purple-50";
    return "bg-blue-100";
  };

  const renderTasks = (list: any[]) => (
    <div className="space-y-2">
      {list.map((task) => (
        <div
          key={task.id}
          className={`flex items-center justify-between p-2 rounded-md shadow-sm ${getBgColor(
            task.dueDate
          )}`}
          style={{ minHeight: "42px" }}
        >
          <span className="flex-1 font-medium">{task.title}</span>
          <select
            value={task.status}
            onChange={(e) => updateTask(task.id, { status: e.target.value })}
            className="mx-2 border rounded px-2 py-1 text-sm"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <input
            type="date"
            value={task.dueDate}
            onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      {overdue.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Overdue</h3>
          {renderTasks(overdue)}
        </div>
      )}
      {todayTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Today</h3>
          {renderTasks(todayTasks)}
        </div>
      )}
      {tomorrowTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Tomorrow</h3>
          {renderTasks(tomorrowTasks)}
        </div>
      )}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Upcoming</h3>
          {renderTasks(upcoming)}
        </div>
      )}
    </div>
  );
};

export default TasksTab;