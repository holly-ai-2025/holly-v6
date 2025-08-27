import React from "react";

export default function HabitsTab({ habits = [] }: { habits?: any[] }) {
  return (
    <div>
      <h2>Habits</h2>
      {habits.length === 0 ? (
        <p>No habits yet</p>
      ) : (
        <ul>
          {habits.map((h, i) => (
            <li key={i}>{h.habit_name || "Unnamed Habit"}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
