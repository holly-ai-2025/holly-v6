import React from "react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = ["Inbox", "Tasks", "Projects", "Calendar"];

  return (
    <header className="w-full flex flex-col bg-white">
      {/* Tabs */}
      <div className="flex items-center justify-between px-6 pt-4">
        <div className="flex items-center space-x-6">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`text-lg font-medium transition-colors duration-200 pb-2 ${
                activeTab === item
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-800 hover:text-gray-900"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Divider */}
      <div className="mt-2 h-[3px] bg-[#d0d8e0] mx-6"></div>
    </header>
  );
};

export default Header;