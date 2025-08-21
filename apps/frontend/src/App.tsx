import React, { useState } from "react";
import Header from "./Header";
import RightPanel from "./RightPanel";
import CalendarView from "./CalendarView";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inbox");

  return (
    <div className="flex min-h-screen bg-light-blue">
      <div className="flex-1 flex flex-col">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex flex-1 p-4 gap-4">
          <div className="flex-1 bg-white shadow-lg rounded-xl p-4 overflow-auto">
            {activeTab === "inbox" && <div>📥 Inbox placeholder content</div>}
            {activeTab === "tasks" && <div>✅ Tasks placeholder content</div>}
            {activeTab === "projects" && <div>📂 Projects placeholder content</div>}
            {activeTab === "calendar" && <CalendarView />}
          </div>
          <RightPanel />
        </main>
      </div>
    </div>
  );
};

export default App;
