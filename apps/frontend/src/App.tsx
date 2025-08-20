import React from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { MainView } from "./components/MainView";

export default function App() {
  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <MainView />
      </div>
    </div>
  );
}