import React from "react";

const dummyData: Record<string, React.ReactNode> = {
  Inbox: (
    <ul className="space-y-2">
      <li className="p-3 rounded-xl bg-card shadow">📝 Draft blog post idea</li>
      <li className="p-3 rounded-xl bg-card shadow">📧 Reply to Sarah</li>
      <li className="p-3 rounded-xl bg-card shadow">💡 Random thought: AI + ADHD app</li>
    </ul>
  ),
  Today: (
    <ul className="space-y-2">
      <li className="p-3 rounded-xl bg-card shadow">✅ Morning run</li>
      <li className="p-3 rounded-xl bg-card shadow">📞 Call with Alex</li>
      <li className="p-3 rounded-xl bg-card shadow">✍️ Work on Holly wireframe</li>
    </ul>
  ),
  Upcoming: (
    <ul className="space-y-2">
      <li className="p-3 rounded-xl bg-card shadow">🗓️ Dentist appointment (Fri)</li>
      <li className="p-3 rounded-xl bg-card shadow">🎂 Friend's birthday (Sat)</li>
    </ul>
  ),
  Projects: (
    <div>
      <h3 className="font-semibold mb-2">Holly AI</h3>
      <ul className="space-y-2">
        <li className="p-3 rounded-xl bg-card shadow">📌 Set up backend scaffold</li>
        <li className="p-3 rounded-xl bg-card shadow">🎨 Finalize UI design</li>
      </ul>
      <h3 className="font-semibold mt-4 mb-2">Personal</h3>
      <ul className="space-y-2">
        <li className="p-3 rounded-xl bg-card shadow">📖 Read new book</li>
      </ul>
    </div>
  ),
  Habits: (
    <ul className="space-y-2">
      <li className="p-3 rounded-xl bg-card shadow">🏃‍♂️ Exercise — Streak: 5 days</li>
      <li className="p-3 rounded-xl bg-card shadow">📚 Read — Streak: 12 days</li>
      <li className="p-3 rounded-xl bg-card shadow">🛏️ Sleep before midnight — Streak: 3 days</li>
    </ul>
  ),
  "Recent Actions": (
    <ul className="space-y-2">
      <li className="p-3 rounded-xl bg-card shadow">✔️ Completed: Call with Alex</li>
      <li className="p-3 rounded-xl bg-card shadow">↩️ Undid: Deleted task</li>
      <li className="p-3 rounded-xl bg-card shadow">✨ Added: New habit — Sleep before midnight</li>
    </ul>
  ),
};

export function MainView({ section }: { section: string }) {
  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">{section}</h2>
      {dummyData[section] || <p>No data for this section.</p>}
    </main>
  );
}