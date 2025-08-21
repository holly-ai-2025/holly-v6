export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  people: string[];
  type: 'dashboard' | 'mobile' | 'web';
};

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Employee Details',
    description: 'Create a page where there is information about employees',
    dueDate: new Date().toISOString(),
    status: 'todo',
    priority: 'high',
    people: ['AB'],
    type: 'dashboard',
  },
  {
    id: '2',
    title: 'Darkmode version',
    description: 'Darkmode version for all screens',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    status: 'in_progress',
    priority: 'medium',
    people: ['CD','EF'],
    type: 'mobile',
  },
  {
    id: '3',
    title: 'Super Admin Role',
    description: 'Add super admin role with permissions',
    dueDate: new Date(Date.now() + 2*86400000).toISOString(),
    status: 'todo',
    priority: 'low',
    people: ['GH'],
    type: 'web',
  }
];