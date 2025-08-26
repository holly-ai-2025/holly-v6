import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Progress from "@/components/ui/Progress";
// Icons replaced with emoji to avoid external dependency
import { tasks as allTasks } from "@/data/tasks";

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

  const tasks = allTasks.slice(0, 3);

  return (
    <div className="grid grid-cols-[280px_1fr_260px] h-screen bg-gray-50 text-gray-900">
      {/* Sidebar (Left) */}
      <aside className="bg-white border-r p-4 flex flex-col gap-6 shadow-md">
        {/* Chat Section */}
        <Card className="flex-1">
        <CardHeader className="flex items-center gap-2">
          <span className="text-indigo-600">💬</span>
          <CardTitle>Chat with Holly</CardTitle>
        </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  msg.from === "You"
                    ? "bg-indigo-100 ml-auto max-w-[80%]"
                    : "bg-gray-100 mr-auto max-w-[80%]"
                }`}
              >
                <span className="font-medium">{msg.from}:</span> {msg.text}
              </div>
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
                <Button variant="outline" size="sm">↺</Button>
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
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">Due {task.due}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  task.status === "Done"
                    ? "bg-green-100 text-green-700"
                    : task.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="bg-white border-l p-4 flex flex-col gap-6 shadow-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="text-orange-500">🔥</span> Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">5 days 🔥</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="text-purple-500">🏆</span> Achievements
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
