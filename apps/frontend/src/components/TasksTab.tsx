import React from 'react';
import { tasks } from '../data/tasks';
import { groupTasks } from '../utils/groupTasks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const TaskRow: React.FC<{ task: any }> = ({ task }) => (
  <Card className="rounded-2xl shadow p-3 flex items-center justify-between">
    <CardContent className="flex-1 grid grid-cols-6 gap-2 items-center">
      <span className="col-span-2 font-medium">{task.title}</span>
      <span className="col-span-2 text-sm text-gray-600">{task.description}</span>
      <span className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</span>
      <span className="capitalize text-xs px-2 py-1 rounded bg-gray-100">{task.priority}</span>
    </CardContent>
    <Button size="sm">Complete</Button>
  </Card>
);

const TasksTab: React.FC = () => {
  const grouped = groupTasks(tasks);

  return (
    <div className="p-4">
      <Section title="Today">
        {grouped.today.map(task => <TaskRow key={task.id} task={task} />)}
      </Section>
      <Section title="Tomorrow">
        {grouped.tomorrow.map(task => <TaskRow key={task.id} task={task} />)}
      </Section>
      <Section title="This Week">
        {grouped.thisWeek.map(task => <TaskRow key={task.id} task={task} />)}
      </Section>
      <Section title="Later">
        {grouped.later.map(task => <TaskRow key={task.id} task={task} />)}
      </Section>
    </div>
  );
};

export default TasksTab;