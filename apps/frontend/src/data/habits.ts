export interface Habit {
  id: string;
  name: string;
  type: "Daily" | "Weekly" | "Monthly" | "Yearly";
  streak: number;
  goal: string;
  status: "Active" | "Missed";
}

export const habits: Habit[] = [
  // 5 daily
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `hd${i + 1}`,
    name: `Daily Habit ${i + 1}`,
    type: "Daily" as const,
    streak: Math.floor(Math.random() * 30),
    goal: "Daily",
    status: Math.random() > 0.2 ? "Active" : "Missed",
  })),

  // 10 weekly
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `hw${i + 1}`,
    name: `Weekly Habit ${i + 1}`,
    type: "Weekly" as const,
    streak: Math.floor(Math.random() * 10),
    goal: "Weekly",
    status: Math.random() > 0.2 ? "Active" : "Missed",
  })),

  // 5 monthly
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `hm${i + 1}`,
    name: `Monthly Habit ${i + 1}`,
    type: "Monthly" as const,
    streak: Math.floor(Math.random() * 5),
    goal: "Monthly",
    status: Math.random() > 0.2 ? "Active" : "Missed",
  })),

  // 1 yearly
  {
    id: "hy1",
    name: "Yearly Habit 1",
    type: "Yearly",
    streak: 1,
    goal: "Yearly",
    status: "Active",
  },
];

