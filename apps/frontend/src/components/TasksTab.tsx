import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import tasksData from "../data/tasks";

const Section: React.FC<{ title: string; color: string; tasks: any[] }> = ({ title, color, tasks }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className={`text-lg font-semibold ${color}`}>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between p-2 border rounded-md bg-white shadow-sm">
              <span>{task.title}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">⋮</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No tasks</p>
      )}
    </CardContent>
  </Card>
);

const TasksTab: React.FC = () => {
  const overdue = tasksData.filter((t) => t.due === "overdue");
  const today = tasksData.filter((t) => t.due === "today");
  const tomorrow = tasksData.filter((t) => t.due === "tomorrow");
  const upcoming = tasksData.filter((t) => t.due === "upcoming");

  return (
    <div className="space-y-4">
      <Section title="Overdue" color="text-red-600" tasks={overdue} />
      <Section title="Today" color="text-green-600" tasks={today} />
      <Section title="Tomorrow" color="text-blue-600" tasks={tomorrow} />
      <Section title="Upcoming" color="text-gray-600" tasks={upcoming} />
    </div>
  );
};

export default TasksTab;
