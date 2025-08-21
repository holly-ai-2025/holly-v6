import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const streakData = [
  { day: "Mon", streak: 3 },
  { day: "Tue", streak: 4 },
  { day: "Wed", streak: 5 },
  { day: "Thu", streak: 6 },
  { day: "Fri", streak: 7 },
];

const RightPanel: React.FC = () => {
  return (
    <div className="w-80 h-full bg-white border-l border-gray-200 shadow-lg p-3 flex flex-col space-y-4">
      {/* Streak Widget */}
      <div className="bg-white shadow rounded-2xl p-3">
        <h2 className="text-purple-600 font-semibold mb-2">Streaks</h2>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={streakData}>
            <XAxis dataKey="day" hide />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="streak" stroke="#8b5cf6" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Points Widget */}
      <div className="bg-white shadow rounded-2xl p-3 text-center">
        <h2 className="text-purple-600 font-semibold">Points</h2>
        <p className="text-3xl font-bold text-gray-800 mt-2">1,245</p>
        <p className="text-sm text-gray-500">+120 this week</p>
      </div>

      {/* Badge Widget */}
      <div className="bg-white shadow rounded-2xl p-3">
        <h2 className="text-purple-600 font-semibold mb-2">Badges</h2>
        <div className="flex space-x-2">
          <div className="w-10 h-10 bg-yellow-400 rounded-full" title="Gold"></div>
          <div className="w-10 h-10 bg-gray-400 rounded-full" title="Silver"></div>
          <div className="w-10 h-10 bg-orange-400 rounded-full" title="Bronze"></div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
