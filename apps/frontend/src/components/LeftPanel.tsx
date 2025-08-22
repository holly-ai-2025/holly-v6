import React from "react";

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
    <div className="flex flex-col h-full bg-white border-r p-4 space-y-4 w-80">
      <div className="flex-1 overflow-y-auto">
        {messages.map((m, idx) => (
          <ChatMessage key={idx} from={m.from} text={m.text} />
        ))}
      </div>
      <div className="mt-auto">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="border-t pt-2">
        <h3 className="font-semibold mb-2">Activity Log</h3>
        <ul className="text-sm space-y-1 text-gray-600">
          <li>✔ Task created: "Write UI mockup"</li>
          <li>✔ Inbox item archived</li>
          <li>✔ Project milestone updated</li>
        </ul>
      </div>
    </div>
  );
};

export default LeftPanel;