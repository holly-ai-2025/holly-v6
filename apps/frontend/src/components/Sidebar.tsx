import React from "react";
import { Home, Calendar, ListTodo, Folder, Repeat, History } from "lucide-react";

const navItems = [
  { icon: Home, label: "Inbox" },
  { icon: Calendar, label: "Today" },
  { icon: ListTodo, label: "Upcoming" },
  { icon: Folder, label: "Projects" },
  { icon: Repeat, label: "Habits" },
  { icon: History, label: "Recent Actions" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-muted p-4 flex flex-col space-y-2 shadow-xl">
      <h1 className="text-xl font-bold mb-4">Holly AI</h1>
      {navItems.map((item) => (
        <button
          key={item.label}
          className="flex items-center space-x-3 p-2 rounded-xl hover:bg-accent transition"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}