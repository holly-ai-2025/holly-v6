import React from "react";

interface SidePanelProps {
  title: string;
  children: React.ReactNode;
  position?: "left" | "right";
}

const SidePanel: React.FC<SidePanelProps> = ({ title, children, position = "left" }) => {
  return (
    <div
      className={`$${position === "left" ? "bg-gray-100" : "bg-gray-50"} w-80 p-4 border-${position === "left" ? "r" : "l"} border-gray-200`}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default SidePanel;
