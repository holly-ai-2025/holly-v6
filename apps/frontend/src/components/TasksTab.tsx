import React, { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const TasksTab: React.FC = () => {
  const { tasks, markComplete, addTask } = useTaskStore();
  const [newTask, setNewTask] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const todaysTasks = tasks.filter(
    (t) => t.dueDate.startsWith(today) && !t.completed
  );
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Quick add task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <Button
          onClick={() => {
            if (newTask) {
              addTask(newTask, today);
              setNewTask("");
            }
          }}
        >
          Add
        </Button>
      </div>

      <h2 className="text-xl mb-2">Today's Tasks</h2>
      {todaysTasks.map((task) => (
        <Card key={task.id} className="mb-2">
          <CardContent className="flex justify-between items-center">
            <span>{task.title}</span>
            <Button onClick={() => markComplete(task.id)}>Done</Button>
          </CardContent>
        </Card>
      ))}

      <h2 className="text-xl mt-4 mb-2">Completed</h2>
      {completed.map((task) => (
        <Card key={task.id} className="mb-2 bg-gray-200">
          <CardContent>
            <span className="line-through">{task.title}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TasksTab;