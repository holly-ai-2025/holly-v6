import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts/lib';

const RightPanel: React.FC = () => {
  const data = [
    { name: 'Mon', uv: 400 },
    { name: 'Tue', uv: 300 },
    { name: 'Wed', uv: 500 },
    { name: 'Thu', uv: 200 },
    { name: 'Fri', uv: 700 },
    { name: 'Sat', uv: 600 },
    { name: 'Sun', uv: 800 },
  ];

  return (
    <div className="w-80 bg-gray-50 p-4 border-l border-gray-200 overflow-y-auto">
      {/* Streak Tracker */}
      <div className="bg-white shadow rounded-xl p-4 mb-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">🔥 Streak</h3>
        <p className="text-2xl font-bold text-purple-600">5 Days</p>
      </div>

      {/* Goal Ring */}
      <div className="bg-white shadow rounded-xl p-4 mb-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">🎯 Goal Progress</h3>
        <div className="w-24 h-24 rounded-full border-8 border-purple-400 flex items-center justify-center text-xl font-bold text-purple-700">
          70%
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white shadow rounded-xl p-4 mb-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">🏆 Achievements</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">✔</div>
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white shadow rounded-xl p-4 mb-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">📊 Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="uv" stroke="#7E57C2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* XP Progress */}
      <div className="bg-white shadow rounded-xl p-4 mb-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">🧩 XP Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-purple-500 h-4 rounded-full" style={{ width: '60%' }}></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Level 3 - 60%</p>
      </div>
    </div>
  );
};

export default RightPanel;