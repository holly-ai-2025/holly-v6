import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarView: React.FC = () => {
  const [value, setValue] = useState(new Date());

  return (
    <div className="bg-white shadow rounded-2xl p-4">
      <h2 className="text-purple-600 font-semibold mb-3">Calendar</h2>
      <Calendar value={value} onChange={setValue} className="rounded-lg" />
    </div>
  );
};

export default CalendarView;
