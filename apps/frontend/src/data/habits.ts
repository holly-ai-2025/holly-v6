export interface Habit {
  id: string;
  name: string;
  type: 'Daily' | 'Weekly' | 'Monthly';
  streak: number;
  goal: string;
  status: 'Active' | 'Missed';
}

export const habits: Record<'daily' | 'weekly' | 'monthly', Habit[]> = {
  daily: [
    { id: 'hd1', name: 'Morning Stretch', type: 'Daily', streak: 5, goal: 'Every morning', status: 'Active' },
    { id: 'hd2', name: 'Read 10 pages', type: 'Daily', streak: 3, goal: 'Every day', status: 'Active' },
    { id: 'hd3', name: 'Meditation', type: 'Daily', streak: 1, goal: 'Daily session', status: 'Missed' }
  ],
  weekly: [
    { id: 'hw1', name: 'Call parents', type: 'Weekly', streak: 2, goal: 'Once a week', status: 'Active' },
    { id: 'hw2', name: 'Grocery shopping', type: 'Weekly', streak: 4, goal: 'Weekly run', status: 'Active' },
    { id: 'hw3', name: 'Clean house', type: 'Weekly', streak: 1, goal: 'Weekly tidy', status: 'Missed' }
  ],
  monthly: [
    { id: 'hm1', name: 'Budget review', type: 'Monthly', streak: 6, goal: 'Monthly check', status: 'Active' },
    { id: 'hm2', name: 'Plan trip', type: 'Monthly', streak: 2, goal: 'Monthly plan', status: 'Active' },
    { id: 'hm3', name: 'Deep clean', type: 'Monthly', streak: 0, goal: 'Monthly deep clean', status: 'Missed' }
  ]
};
