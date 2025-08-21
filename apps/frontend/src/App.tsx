import React from "react";
import Header from "./Header.tsx";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import CalendarView from "./CalendarView";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("inbox");

  return (
    <div className="flex min-h-screen bg-light-blue">
      {/* Left Panel */}
      <LeftPanel />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "calendar" ? (
          <CalendarView />
        ) : (
          <div className="p-6 bg-white rounded-xl shadow-lg mt-4">
            <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
            <p className="text-gray-600 mt-2">
              Content for the {activeTab} tab will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
};

export default App;