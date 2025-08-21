import React, { useState } from 'react';
import { tasks as initialTasks } from '../data/tasks';
import { groupTasks } from '../utils/groupTasks';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const priorityColors: Record<string, string> = {
  high: 'bg-red-200 text-red-800',
  medium: 'bg-yellow-200 text-yellow-800',
  low: 'bg-green-200 text-green-800',
};

const TaskRow: React.FC<{ task: any; onToggle: () => void }> = ({ task, onToggle }) => (
  <div className={`rounded-lg border p-3 flex items-center justify-between ${task.status === 'done' ? 'opacity-70' : ''}`}>
    <div className="flex-1 grid grid-cols-6 gap-2 items-center">
      <span className={`col-span-2 font-medium ${task.status === 'done' ? 'line-through' : ''}`}>{task.title}</span>
      <span className={`col-span-2 text-sm text-gray-600 ${task.status === 'done' ? 'line-through' : ''}`}>{task.description}</span>
      <span className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</span>
      <span className={`capitalize text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>{task.priority}</span>
    </div>
    <button
      className={`ml-2 px-3 py-1 rounded text-sm font-medium transition ${task.status === 'done' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      onClick={onToggle}
    >
      {task.status === 'done' ? 'Undo' : 'Complete'}
    </button>
  </div>
);

const TasksTab: React.FC = () => {
  const [taskState, setTaskState] = useState(initialTasks);

  const handleToggle = (id: string) => {
    setTaskState(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t));
  };

  const grouped = groupTasks(taskState);

  return (
    <div className="p-4">
      <Section title="Today">
        {grouped.today.map(task => <TaskRow key={task.id} task={task} onToggle={() => handleToggle(task.id)} />)}
      </Section>
      <Section title="Tomorrow">
        {grouped.tomorrow.map(task => <TaskRow key={task.id} task={task} onToggle={() => handleToggle(task.id)} />)}
      </Section>
      <Section title="This Week">
        {grouped.thisWeek.map(task => <TaskRow key={task.id} task={task} onToggle={() => handleToggle(task.id)} />)}
      </Section>
      <Section title="Later">
        {grouped.later.map(task => <TaskRow key={task.id} task={task} onToggle={() => handleToggle(task.id)} />)}
      </Section>
    </div>
  );
};

export default TasksTab;