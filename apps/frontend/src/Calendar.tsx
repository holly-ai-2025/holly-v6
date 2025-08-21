import React, { useState } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, isSameMonth, isSameDay, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog } from '@headlessui/react';

const dummyEvents: Record<string, string[]> = {
  '2025-08-10': ["Doctor Appointment", "Team Call"],
  '2025-08-15': ["Project Deadline", "Dinner with friends"],
  '2025-08-21': ["Finish Wireframe PR", "Gym Session"],
};

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const key = format(day, 'yyyy-MM-dd');
      days.push(
        <div
          key={day.toString()}
          className={`p-2 text-center cursor-pointer rounded-lg ${!isSameMonth(day, monthStart) ? 'text-gray-400' : isSameDay(day, new Date()) ? 'bg-purple-500 text-white' : 'hover:bg-purple-100'}`}
          onClick={() => setSelectedDate(cloneDay)}
        >
          <span>{formattedDate}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
    days = [];
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft /></button>
        <h2 className="text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight /></button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 font-medium text-gray-600 mb-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center">{d}</div>)}
      </div>

      {/* Dates */}
      {rows}

      {/* Modal */}
      <Dialog open={!!selectedDate} onClose={() => setSelectedDate(null)} className="fixed inset-0 flex items-center justify-center z-50">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="bg-white rounded-xl shadow-xl p-6 z-50 w-96">
          <Dialog.Title className="text-lg font-bold mb-4">Events on {selectedDate && format(selectedDate, 'MMMM d, yyyy')}</Dialog.Title>
          <ul className="list-disc pl-5">
            {(dummyEvents[selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''] || ["No events"]).map((event, i) => (
              <li key={i}>{event}</li>
            ))}
          </ul>
          <button onClick={() => setSelectedDate(null)} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">Close</button>
        </div>
      </Dialog>
    </div>
  );
}