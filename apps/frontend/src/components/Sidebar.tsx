import React from "react";
// Icon imports removed for simpler build
const navItems = [
  { label: "Inbox" },
  { label: "Today" },
  { label: "Upcoming" },
  { label: "Projects" },
  { label: "Habits" },
  { label: "Recent Actions" },
];

export function Sidebar({ active, onSelect }: { active: string; onSelect: (label: string) => void }) {
  return (
    <aside className="w-64 bg-muted p-4 flex flex-col space-y-2 shadow-xl">
      <h1 className="text-xl font-bold mb-4">Holly AI</h1>
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => onSelect(item.label)}
          className={`flex items-center space-x-3 p-2 rounded-xl transition ${
            active === item.label ? "bg-primary text-white" : "hover:bg-accent"
          }`}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}