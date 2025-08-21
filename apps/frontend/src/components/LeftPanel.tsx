import React, { useState } from "react";
import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";

const LeftPanel: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [micActive, setMicActive] = useState(false);

  return (
    <div
      className="w-16 h-full bg-gray-50 border-r flex flex-col items-center justify-between py-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered ? (
        <div className="flex flex-col space-y-4 w-48 p-4 bg-white shadow-lg rounded-2xl">
          <div className="flex-1">
            <h2 className="font-semibold mb-2">Chat</h2>
            <div className="h-40 overflow-y-auto border rounded-md p-2 text-sm">
              <p>User: Hi Holly</p>
              <p>Holly: Hello! Ready to get things done?</p>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold mb-2">Logs</h2>
            <div className="h-40 overflow-y-auto border rounded-md p-2 text-sm">
              <p>[Action] Created task "Finish report"</p>
              <p>[Action] Scheduled meeting at 2PM</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-10 h-10 bg-purple-600 rounded-full"
          />
          <button
            onClick={() => setMicActive(!micActive)}
            className={`p-2 rounded-full ${
              micActive ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            <Volume2 size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LeftPanel;