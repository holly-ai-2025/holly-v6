import { useState } from "react";
import InboxTab from "./components/InboxTab";
import ProjectsTab from "./components/ProjectsTab";
import CalendarTab from "./components/CalendarTab";
import TasksTab from "./components/TasksTab";

export default function App() {
  const [activeTab, setActiveTab] = useState("Inbox");

  return (
    <div className="flex h-screen">
      {/* Left sidebar */}
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="font-bold text-xl mb-4">Chat</h2>
        <div className="h-1/2 border p-2 mb-4">Chat box here</div>

        <h2 className="font-bold text-xl mb-2">Activity Log</h2>
        <div className="h-1/3 border p-2">Activity log here</div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex space-x-6 mb-4 border-b pb-2">
          {['Inbox', 'Tasks', 'Projects', 'Calendar'].map((tab) => (
            <button
              key={tab}
              className={`${activeTab === tab ? "text-purple-600 font-bold" : "text-gray-600"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Inbox" && <InboxTab />}
        {activeTab === "Tasks" && <TasksTab />}
        {activeTab === "Projects" && <ProjectsTab />}
        {activeTab === "Calendar" && <CalendarTab />}
      </div>

      {/* Right sidebar */}
      <div className="w-64 bg-gray-50 p-4 border-l">
        <h2 className="font-bold text-xl mb-4">Streaks</h2>
        <div className="h-24 border mb-4">Streak chart here</div>

        <h2 className="font-bold text-xl mb-4">Points</h2>
        <div className="text-2xl font-bold">1,245</div>
        <p className="text-sm text-gray-500 mb-4">+120 this week</p>

        <h2 className="font-bold text-xl mb-2">Badges</h2>
        <div className="flex space-x-2">
          <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}