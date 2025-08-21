import React, { useState } from "react";
import Header from "./Header";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import CalendarPopup from "./CalendarPopup";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-light-blue">
      {/* Left Panel */}
      <LeftPanel />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} onOpenCalendar={() => setCalendarOpen(true)} />
        <div className="flex-1 bg-white rounded-xl shadow-lg mt-4 p-6">
          {activeTab === "inbox" && <div>📥 Inbox content here</div>}
          {activeTab === "tasks" && <div>✅ Tasks content here</div>}
          {activeTab === "projects" && <div>📂 Projects content here</div>}
          {activeTab === "calendar" && <div>🗓 Calendar overview (open popup for details)</div>}
        </div>
      </div>

      {/* Right Panel */}
      <RightPanel />

      {/* Calendar Popup */}
      <CalendarPopup isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} />
    </div>
  );
};

export default App;