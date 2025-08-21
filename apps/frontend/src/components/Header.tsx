import { useState } from "react";

const Header = () => {
  const [active, setActive] = useState("Inbox");

  const menuItems = ["Inbox", "Tasks", "Projects", "Calendar"];

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md rounded-xl">
      {/* Left side nav */}
      <nav className="flex space-x-8">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`text-gray-700 pb-1 ${
              active === item
                ? "border-b-2 border-deep-purple font-medium"
                : "hover:text-deep-purple"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right side search */}
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-medium-purple"
        />
      </div>
    </header>
  );
};

export default Header;