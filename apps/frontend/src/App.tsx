import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Undo, Flame, Award } from "lucide-react";

export default function App() {
  const [messages] = useState([
    { from: "Holly", text: "Good morning! Ready to plan your day?" },
    { from: "You", text: "Yes, let’s go." },
    { from: "Holly", text: "Don’t forget to take a break later!" },
  ]);

  const actions = [
    { id: 1, text: "Marked task 'Finish report' as complete" },
    { id: 2, text: "Scheduled meeting with Alex" },
    { id: 3, text: "Created new habit: Morning Walk" },
  ];

  const tasks = [
    { id: 1, title: "Finish project proposal", status: "In Progress", tag: "Work" },
    { id: 2, title: "Read 20 pages", status: "Not Started", tag: "Personal" },
    { id: 3, title: "Meditation", status: "Completed", tag: "Wellness" },
  ];

  return (
    <div className="grid grid-cols-[280px_1fr_260px] h-screen bg-gray-50 text-gray-900">
      {/* Sidebar (Left) */}
      <aside className="bg-white border-r p-4 flex flex-col gap-6 shadow-md">
        {/* Chat Section */}
        <Card className="flex-1">
          <CardHeader className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            <CardTitle>Chat with Holly</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`p-2 rounded-lg ${
                  msg.from === "You"
                    ? "bg-indigo-100 ml-auto max-w-[80%]"
                    : "bg-gray-100 mr-auto max-w-[80%]"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="font-medium">{msg.from}:</span> {msg.text}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {actions.map((action) => (
              <div key={action.id} className="flex justify-between items-center text-sm">
                <span>{action.text}</span>
                <Button variant="outline" size="sm">
                  <Undo className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Today’s Focus</h1>
        <div className="grid gap-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">{task.tag}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : task.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {task.status}
              </span>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="bg-white border-l p-4 flex flex-col gap-6 shadow-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Flame className="text-orange-500" /> Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">5 days 🔥</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Award className="text-purple-500" /> Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Level 2 Explorer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">XP Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={80} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">1200 / 1500 XP</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}