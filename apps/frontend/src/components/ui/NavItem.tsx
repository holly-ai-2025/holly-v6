import React from "react";

interface NavItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ label, active = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer px-3 py-2 text-sm font-medium border-b-2 transition 
        ${active ? "border-purple-600 text-purple-600" : "border-transparent text-gray-700 hover:text-purple-600 hover:border-purple-600"}`}
    >
      {label}
    </div>
  );
};

export default NavItem;
