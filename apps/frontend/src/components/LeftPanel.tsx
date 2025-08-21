import React from "react";
import { NavItem } from "./ui/NavItem";

interface LeftPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-60 bg-gray-50 h-full flex flex-col p-4 border-r">
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      <NavItem label="Inbox" active={activeTab === "inbox"} onClick={() => setActiveTab("inbox")} />
      <NavItem label="Tasks" active={activeTab === "tasks"} onClick={() => setActiveTab("tasks")} />
      <NavItem label="Projects" active={activeTab === "projects"} onClick={() => setActiveTab("projects")} />
      <NavItem label="Calendar" active={activeTab === "calendar"} onClick={() => setActiveTab("calendar")} />
    </div>
  );
};

export default LeftPanel;
