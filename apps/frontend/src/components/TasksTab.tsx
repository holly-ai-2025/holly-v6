import React, { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { Card, CardHeader, CardContent } from "./ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <Card className="mb-4">
      <CardHeader className="flex justify-between items-center cursor-pointer" onClick={() => setOpen(!open)}>
        <h2 className="font-semibold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-500">{open ? "▼" : "▲"}</span>
      </CardHeader>
      {open && <CardContent className="space-y-2">{children}</CardContent>}
    </Card>
  );
};

const TaskItem = ({ task }) => {
  let bg = "bg-gray-100";
  const today = new Date().toISOString().split("T")[0];
  if (task.dueDate < today) bg = "bg-red-100";
  else if (task.dueDate === today) bg = "bg-purple-100";
  else bg = "bg-blue-100";

  return (
    <Card className={`flex justify-between items-center px-3 py-2 shadow-sm text-sm ${bg}`}>
      <span className="font-medium text-gray-800">{task.title}</span>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">{task.status}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Todo</DropdownMenuItem>
            <DropdownMenuItem>In Progress</DropdownMenuItem>
            <DropdownMenuItem>Done</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <input type="date" value={task.dueDate} className="border rounded px-1 text-sm" />
      </div>
    </Card>
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