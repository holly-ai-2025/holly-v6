import React from "react";
// Icons replaced with emoji for minimal build

export function TopBar({ onToggleVoice }: { onToggleVoice: () => void }) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-card shadow-sm">
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full hover:bg-accent" onClick={onToggleVoice}>
          🎤
        </button>
        <span className="text-sm text-muted-foreground">Voice</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-muted px-2 py-1 rounded-xl">
          <span className="mr-1">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm"
          />
        </div>
        <button className="p-2 rounded-full hover:bg-accent">☀️</button>
      </div>
    </header>
  );
}