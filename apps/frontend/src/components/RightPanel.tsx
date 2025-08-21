import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", streak: 3 },
  { name: "Tue", streak: 4 },
  { name: "Wed", streak: 5 },
  { name: "Thu", streak: 2 },
  { name: "Fri", streak: 6 },
  { name: "Sat", streak: 7 },
  { name: "Sun", streak: 5 },
];

const RightPanel: React.FC = () => {
  return (
    <div className="w-80 h-full bg-gray-50 border-l p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
      <Card className="mb-6">
        <CardContent>
          <h3 className="font-medium mb-2">Weekly Streak</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="streak" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightPanel;