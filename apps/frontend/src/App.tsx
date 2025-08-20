import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { MainView } from "./components/MainView";

export default function App() {
  const [activeSection, setActiveSection] = useState("Inbox");

  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      <Sidebar active={activeSection} onSelect={setActiveSection} />
      <div className="flex flex-col flex-1">
        <TopBar />
        <MainView section={activeSection} />
      </div>
    </div>
  );
}