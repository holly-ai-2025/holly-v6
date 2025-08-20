import React from "react";

export function MainView() {
  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Quick Capture</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 border rounded-xl px-3 py-2 text-sm"
          />
          <button className="px-4 py-2 bg-primary text-white rounded-xl shadow">
            Add
          </button>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Today (Mock Data)</h2>
        <ul className="space-y-2">
          <li className="p-3 rounded-xl bg-card shadow">✅ Example Task 1</li>
          <li className="p-3 rounded-xl bg-card shadow">🔄 Example Task 2</li>
          <li className="p-3 rounded-xl bg-card shadow">⭐ Example Task 3</li>
        </ul>
      </section>
    </main>
  );
}