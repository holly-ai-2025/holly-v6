import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mic } from "lucide-react";

export default function HollyApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [micActive, setMicActive] = useState(false);

  return (
    <div className="flex min-h-screen bg-light-blue text-gray-900">
      {/* Sidebar */}
      <motion.div
        className={`relative flex-shrink-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-80" : "w-20"
        } bg-white shadow-lg rounded-r-xl overflow-hidden`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {sidebarOpen ? (
          <div className="flex flex-col h-full p-4">
            <h2 className="text-lg font-semibold text-deep-purple mb-2">Chat</h2>
            <div className="flex-1 overflow-y-auto space-y-2">
              {/* Dummy chat messages */}
              <div className="self-start bg-gray-200 text-gray-900 px-3 py-2 rounded-lg shadow-md w-fit max-w-[75%]">
                Hi Holly, remind me about my meeting.
              </div>
              <div className="self-end bg-purple-500 text-white px-3 py-2 rounded-lg shadow-md w-fit max-w-[75%]">
                Meeting with design team scheduled for 2pm.
              </div>
            </div>

            <h2 className="text-lg font-semibold text-deep-purple mt-4 mb-2">
              Action Log
            </h2>
            <div className="flex-1 overflow-y-auto bg-gray-50 rounded-md p-2 text-sm border border-gray-200">
              <div>- Scheduled meeting with design team</div>
              <div>- Added 3 tasks to Inbox</div>
              <div>- Updated project deadline</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            {/* Spinning Logo */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-deep-purple to-medium-purple animate-spin-slow shadow-inner-strong" />

            {/* Animated Waveform */}
            <div className="flex items-end space-x-1 h-10">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-bright-blue rounded"
                  animate={{
                    scaleY: micActive
                      ? [0.5, 2, 0.8, 1.5, 1]
                      : [0.7, 1, 0.9, 1.1, 0.8],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: micActive ? 0.8 : 2,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Mic toggle */}
            <button
              onClick={() => setMicActive(!micActive)}
              className={`p-2 rounded-full shadow-md transition ${
                micActive ? "bg-deep-purple text-white" : "bg-gray-300 text-gray-700"
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-medium-purple text-white p-4 rounded-xl shadow-md space-x-6">
          <h1 className="text-xl font-semibold flex-shrink-0">Holly AI</h1>

          {/* Menu Items */}
          <nav className="flex flex-shrink-0 space-x-4">
            {["Inbox", "Today", "Upcoming", "Projects", "Habits", "Recent Actions"].map(
              (item) => (
                <button
                  key={item}
                  className="px-3 py-1 rounded-lg hover:bg-deep-purple transition"
                >
                  {item}
                </button>
              )
            )}
          </nav>

          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-lg px-3 py-1 text-gray-900 flex-1 max-w-sm ml-auto">
            <Search className="w-4 h-4 mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none text-sm bg-transparent w-full"
            />
          </div>
        </div>

        {/* Dummy Main Content */}
        <div className="flex-1 mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-deep-purple mb-4">Today’s Tasks</h2>
          <ul className="space-y-2">
            <li className="p-3 rounded-lg bg-gray-100 shadow-sm">Design review with team</li>
            <li className="p-3 rounded-lg bg-gray-100 shadow-sm">Prepare project timeline</li>
            <li className="p-3 rounded-lg bg-gray-100 shadow-sm">Update client on progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
}