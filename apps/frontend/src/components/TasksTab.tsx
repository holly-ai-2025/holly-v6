import React, { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer border-b pb-1 mb-2"
        onClick={() => setOpen(!open)}
      >
        <h2 className="font-semibold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-500">{open ? "▼" : "▲"}</span>
      </div>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
};

const TaskItem = ({ task }) => {
  let bg = "bg-gray-100";
  const today = new Date().toISOString().split("T")[0];
  if (task.dueDate < today) bg = "bg-red-100";
  else if (task.dueDate === today) bg = "bg-purple-100";
  else bg = "bg-blue-100";

  return (
    <div className={`flex justify-between items-center px-3 py-2 rounded-lg shadow-sm text-sm ${bg}`}>
      <span className="font-medium text-gray-800">{task.title}</span>
      <div className="flex items-center space-x-2">
        <select
          value={task.status}
          className="border rounded px-1 text-sm"
          onChange={() => {}}
        >
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <input type="date" value={task.dueDate} className="border rounded px-1 text-sm" />
      </div>
    </div>
  );
};

const TasksTab = () => {
  const { tasks } = useTaskStore();

  const overdue = tasks.filter((t) => t.dueDate < new Date().toISOString().split("T")[0]);
  const today = tasks.filter((t) => t.dueDate === new Date().toISOString().split("T")[0]);
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tasks.filter((t) => t.dueDate === tomorrowDate.toISOString().split("T")[0]);
  const upcoming = tasks.filter(
    (t) => t.dueDate > tomorrowDate.toISOString().split("T")[0]
  );

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <Section title="Overdue">
        {overdue.map((task, i) => (
          <TaskItem key={i} task={task} />
        ))}
      </Section>
      <Section title="Today">
        {today.map((task, i) => (
          <TaskItem key={i} task={task} />
        ))}
      </Section>
      <Section title="Tomorrow">
        {tomorrow.map((task, i) => (
          <TaskItem key={i} task={task} />
        ))}
      </Section>
      <Section title="Upcoming">
        {upcoming.map((task, i) => (
          <TaskItem key={i} task={task} />
        ))}
      </Section>
    </div>
  );
};

export default TasksTab;