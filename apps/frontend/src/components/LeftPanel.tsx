import React from "react";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Input } from "./ui/input";

const ChatMessage = ({ from, text }: { from: string; text: string }) => (
  <div className={`mb-2 ${from === "me" ? "text-right" : "text-left"}`}>
    <div
      className={`inline-block px-3 py-2 rounded-2xl text-sm shadow-sm ${
        from === "me"
          ? "bg-purple-600 text-white rounded-br-none"
          : "bg-gray-200 text-gray-900 rounded-bl-none"
      }`}
    >
      {text}
    </div>
  </div>
);

const LeftPanel = () => {
  const messages = [
    { from: "system", text: "Hi! How can I help you today?" },
    { from: "me", text: "Remind me about the sprint review." },
    { from: "system", text: "Got it. I’ve scheduled it for tomorrow 10am." },
  ];

  return (
    <Card className="flex flex-col h-full w-80 border-r">
      <CardContent className="flex-1 overflow-y-auto">
        {messages.map((m, idx) => (
          <ChatMessage key={idx} from={m.from} text={m.text} />
        ))}
      </CardContent>
      <CardContent className="mt-auto">
        <Input type="text" placeholder="Type a message..." />
      </CardContent>
      <CardHeader>
        <h3 className="font-semibold mb-2">Activity Log</h3>
        <ul className="text-sm space-y-1 text-gray-600">
          <li>✔ Task created: "Write UI mockup"</li>
          <li>✔ Inbox item archived</li>
          <li>✔ Project milestone updated</li>
        </ul>
      </CardHeader>
    </Card>
  );
};

export default LeftPanel;