import React from "react";

const dummyTranscript = [
  { sender: "You", text: "Hey Holly, remind me to call Alex" },
  { sender: "Holly", text: "Got it, added to Today" },
  { sender: "You", text: "Also add buy groceries" },
  { sender: "Holly", text: "Sure, added to Inbox" },
];

export function VoiceBar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 bg-card border-t shadow-xl transform transition-transform duration-300 ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ maxHeight: "40%" }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="font-semibold">Voice Transcript</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-accent">
          ✕
        </button>
      </div>
      <div className="overflow-y-auto p-4 space-y-2 h-48">
        {dummyTranscript.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl max-w-xs ${
              msg.sender === "You"
                ? "bg-primary text-white ml-auto"
                : "bg-muted text-foreground mr-auto"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}