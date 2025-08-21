import React from "react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = ["Inbox", "Tasks", "Projects", "Calendar"];

  return (
    <header className="w-full flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <div className="flex items-center space-x-6">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`text-lg font-medium transition-colors duration-200 ${
              activeTab === item ? "border-b-2 border-purple-600" : ""
            } text-purple-600 hover:text-purple-800`}
          >
            {item}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;