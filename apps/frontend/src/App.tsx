import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import MainContent from "./MainContent";
import RightPanel from "./RightPanel";

export default function App() {
  const [active, setActive] = useState("Inbox");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active={active} onSelect={setActive} />
      <MainContent />
      <RightPanel />
    </div>
  );
}
