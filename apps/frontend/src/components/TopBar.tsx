import React from "react";
import { Search, Mic, SunMoon } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-card shadow-sm">
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full hover:bg-accent">
          <Mic className="h-5 w-5" />
        </button>
        <span className="text-sm text-muted-foreground">VoiceBar (mock)</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-muted px-2 py-1 rounded-xl">
          <Search className="h-4 w-4 mr-1" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm"
          />
        </div>
        <button className="p-2 rounded-full hover:bg-accent">
          <SunMoon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}