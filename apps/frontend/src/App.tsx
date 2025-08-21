import React, { useState } from "react";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Inbox");

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <LeftPanel />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "Inbox" && <p>Inbox content goes here.</p>}
          {activeTab === "Tasks" && <p>Tasks content goes here.</p>}
          {activeTab === "Projects" && <p>Projects content goes here.</p>}
          {activeTab === "Calendar" && <p>Calendar content goes here.</p>}
        </div>
      </div>

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
};

export default App;