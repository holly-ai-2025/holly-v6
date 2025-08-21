import React, { useState } from "react";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import CalendarPopup from "./components/CalendarPopup";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="flex min-h-screen bg-light-blue">
      {/* Left Panel */}
      <LeftPanel />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} setShowCalendar={setShowCalendar} />
        <div className="flex-1 bg-white rounded-xl shadow-lg p-4 mt-4">
          {activeTab === "inbox" && <p>Inbox Content</p>}
          {activeTab === "tasks" && <p>Tasks Content</p>}
          {activeTab === "projects" && <p>Projects Content</p>}
          {activeTab === "calendar" && <p>Calendar Content</p>}
        </div>
      </div>

      {/* Right Panel */}
      <RightPanel />

      {/* Calendar Popup */}
      {showCalendar && <CalendarPopup onClose={() => setShowCalendar(false)} />}
    </div>
  );
};

export default App;