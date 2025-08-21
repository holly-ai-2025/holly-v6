import React, { useState } from "react";

const LeftPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`h-full transition-all duration-300 ease-in-out bg-white shadow-lg border-r border-gray-200 flex flex-col ${
        isOpen ? "w-80" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <div className="p-2 flex justify-center border-b border-gray-100">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full bg-purple-100 hover:bg-purple-200"
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      {/* Content */}
      {isOpen ? (
        <div className="flex flex-col flex-1 overflow-y-auto p-3 space-y-4">
          {/* Chat Box */}
          <div className="bg-white rounded-2xl shadow p-3 h-1/2 flex flex-col">
            <h2 className="font-semibold text-purple-600 mb-2">Chat</h2>
            <div className="flex-1 overflow-y-auto border rounded-lg p-2 text-sm text-gray-700">
              <p><strong>You:</strong> Hello Holly</p>
              <p><strong>Holly:</strong> Hi! How can I help today?</p>
            </div>
            <input
              type="text"
              placeholder="Type a message..."
              className="mt-2 p-2 border rounded-lg text-sm"
            />
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-2xl shadow p-3 h-1/2 overflow-y-auto">
            <h2 className="font-semibold text-purple-600 mb-2">Activity Log</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✔ Task created: "Write UI mockup"</li>
              <li>✔ Inbox item archived</li>
              <li>✔ Project milestone updated</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 space-y-4">
          {/* Placeholder logo + sound icon */}
          <div className="w-10 h-10 rounded-full bg-purple-500 animate-spin"></div>
          <div className="text-gray-500">🔊</div>
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
