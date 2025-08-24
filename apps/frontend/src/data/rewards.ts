export interface Reward {
  id: string;
  name: string;
  cost: number; // tokens
}

export const rewards: Reward[] = [
  { id: "r1", name: "Movie Night", cost: 20 },
  { id: "r2", name: "Ice Cream", cost: 10 },
  { id: "r3", name: "Day at the Beach", cost: 50 },
  { id: "r4", name: "Weekend Getaway", cost: 200 },
  { id: "r5", name: "New Book", cost: 30 },
  { id: "r6", name: "Fancy Dinner", cost: 100 },
  { id: "r7", name: "Concert Ticket", cost: 80 },
  { id: "r8", name: "Spa Day", cost: 150 },
  { id: "r9", name: "Gaming Session", cost: 25 },
  { id: "r10", name: "New Headphones", cost: 120 },
  { id: "r11", name: "Coffee Treat", cost: 5 },
  { id: "r12", name: "Weekend Road Trip", cost: 300 },
  { id: "r13", name: "Art Supplies", cost: 40 },
  { id: "r14", name: "Subscription Box", cost: 60 },
  { id: "r15", name: "New Outfit", cost: 90 },
];

