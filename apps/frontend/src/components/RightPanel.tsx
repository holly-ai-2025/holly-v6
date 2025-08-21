import React from "react";
import Card from "./ui/Card";

const RightPanel: React.FC = () => {
  return (
    <div className="w-80 bg-gray-50 h-full flex flex-col gap-4 p-4 border-l overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">Your Progress</h2>

      <Card>
        <h3 className="font-semibold mb-2">Daily Streak</h3>
        <p className="text-2xl font-bold text-purple-600">🔥 5 days</p>
      </Card>

      <Card>
        <h3 className="font-semibold mb-2">Tasks Completed</h3>
        <p className="text-2xl font-bold text-green-600">23</p>
      </Card>

      <Card>
        <h3 className="font-semibold mb-2">Focus Time</h3>
        <p className="text-2xl font-bold text-blue-600">12h 45m</p>
      </Card>

      <Card>
        <h3 className="font-semibold mb-2">Weekly Goal</h3>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-purple-600 h-3 rounded-full" style={{ width: "70%" }}></div>
        </div>
      </Card>
    </div>
  );
};

export default RightPanel;
