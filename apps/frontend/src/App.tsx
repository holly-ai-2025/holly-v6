import React, { useState } from "react";
import TasksTab from "./components/TasksTab";

export default function App() {
  const [activeTab, setActiveTab] = useState("Inbox");

  return (
    <div className="flex h-screen">
      {/* Sidebar placeholder */}
      <div className="w-64 bg-gray-100 p-4">Sidebar</div>
      
      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex space-x-4 mb-4">
          {["Inbox", "Tasks", "Projects", "Calendar"].map(tab => (
            <button
              key={tab}
              className={`px-3 py-1 rounded ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Inbox" && <p>Inbox content goes here.</p>}
        {activeTab === "Tasks" && <TasksTab />}
        {activeTab === "Projects" && <p>Projects content goes here.</p>}
        {activeTab === "Calendar" && <p>Calendar content goes here.</p>}
      </div>
    </div>
  );
}