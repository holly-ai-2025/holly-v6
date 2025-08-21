import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", streak: 3 },
  { day: "Tue", streak: 5 },
  { day: "Wed", streak: 2 },
  { day: "Thu", streak: 6 },
  { day: "Fri", streak: 4 },
  { day: "Sat", streak: 7 },
  { day: "Sun", streak: 5 },
];

export default function RightPanel() {
  return (
    <div className="w-80 bg-white border-l border-gray-200 h-screen p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-purple-600 mb-4">Your Progress</h2>

      {/* Streak Chart */}
      <div className="bg-gray-50 rounded-2xl shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Weekly Streak</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="streak" stroke="#9333ea" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Example Dopamine Widget */}
      <div className="bg-gray-50 rounded-2xl shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Focus Time</h3>
        <p className="text-3xl font-bold text-purple-600">4h 20m</p>
        <p className="text-sm text-gray-500">+1h from yesterday</p>
      </div>

      {/* Example Achievement Widget */}
      <div className="bg-gray-50 rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Achievements</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Completed 7 tasks in a row 🎉</li>
          <li>3-day streak of calendar usage 📅</li>
          <li>Logged focus sessions 5 days running 🔥</li>
        </ul>
      </div>
    </div>
  );
}