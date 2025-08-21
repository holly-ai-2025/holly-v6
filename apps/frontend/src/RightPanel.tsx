import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FireIcon, Trophy, Target, Star } from "lucide-react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { day: 'Mon', value: 60 },
  { day: 'Tue', value: 80 },
  { day: 'Wed', value: 50 },
  { day: 'Thu', value: 90 },
  { day: 'Fri', value: 40 },
  { day: 'Sat', value: 70 },
  { day: 'Sun', value: 30 },
];

export default function RightPanel() {
  return (
    <div className="flex flex-col gap-4 p-4 w-80">
      {/* 🔥 Streak */}
      <Card className="p-4 flex items-center gap-3">
        <FireIcon className="text-red-500 w-6 h-6 animate-pulse" />
        <span className="text-lg font-semibold">7 Day Streak!</span>
      </Card>

      {/* 🎯 Goal Ring */}
      <Card className="p-4 flex flex-col items-center">
        <div className="w-24 h-24">
          <CircularProgressbar
            value={75}
            text={`75%`}
            styles={buildStyles({
              pathColor: "#5E40A4",
              textColor: "#5E40A4",
              trailColor: "#d6d6d6",
            })}
          />
        </div>
        <p className="mt-2 font-medium">Daily Goal</p>
      </Card>

      {/* 🧩 XP Progress */}
      <Card className="p-4">
        <p className="font-medium mb-2">XP Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-purple-600 h-3 rounded-full w-[60%]" />
        </div>
        <p className="text-sm text-gray-600 mt-1">Level 3 (60%)</p>
      </Card>

      {/* 🏆 Achievements */}
      <Card className="p-4">
        <p className="font-medium mb-2 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" />Achievements</p>
        <div className="grid grid-cols-4 gap-2">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className={`w-10 h-10 flex items-center justify-center rounded-full ${i % 2 === 0 ? 'bg-yellow-300' : 'bg-gray-300'}`}>
              <Star className="w-5 h-5 text-white" />
            </div>
          ))}
        </div>
      </Card>

      {/* 📊 Weekly Productivity */}
      <Card className="p-4 h-48">
        <p className="font-medium mb-2 flex items-center gap-2"><Target className="w-5 h-5 text-blue-500" />Weekly Productivity</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <XAxis dataKey="day" />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" fill="#7E57C2" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}