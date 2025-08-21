import React, { useState } from "react";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import CalendarView from "./components/CalendarView";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inbox");

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Left panel */}
      <div className="w-1/5 border-r border-gray-200">
        <LeftPanel />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "calendar" ? (
            <CalendarView />
          ) : (
            <div className="text-gray-700">{activeTab} content goes here</div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-1/4 border-l border-gray-200 bg-white">
        <RightPanel />
      </div>
    </div>
  );
};

export default App;