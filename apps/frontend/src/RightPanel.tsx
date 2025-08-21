import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Flame, Award } from "lucide-react";

const data = [
  { day: "Mon", tasks: 3 },
  { day: "Tue", tasks: 5 },
  { day: "Wed", tasks: 2 },
  { day: "Thu", tasks: 6 },
  { day: "Fri", tasks: 4 },
];

const RightPanel = () => {
  return (
    <div className="w-80 bg-white shadow-lg rounded-l-xl p-4 flex flex-col space-y-6">
      {/* Streak */}
      <div className="flex items-center space-x-3">
        <Flame className="text-orange-500 w-6 h-6" />
        <div>
          <p className="font-semibold text-lg">7 Day Streak</p>
          <p className="text-sm text-gray-500">Keep it up!</p>
        </div>
      </div>

      {/* XP Progress */}
      <div>
        <p className="font-semibold mb-1">Level 3</p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-teal-500 h-3 rounded-full w-2/3"></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">120 / 180 XP</p>
      </div>

      {/* Weekly Tasks Graph */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" stroke="#7E57C2" />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="tasks" stroke="#43A6D7" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Achievements */}
      <div>
        <p className="font-semibold mb-2">Achievements</p>
        <div className="flex space-x-3">
          <Award className="text-yellow-500 w-6 h-6" />
          <Award className="text-purple-500 w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default RightPanel;