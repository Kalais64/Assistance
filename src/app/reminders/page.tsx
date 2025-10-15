'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon, BellIcon } from '@heroicons/react/24/outline';

interface Reminder {
  id: number;
  title: string;
  date: string;
  completed: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 1, title: 'Complete JavaScript tutorial', date: '2024-07-15', completed: false },
    { id: 2, title: 'Review React concepts', date: '2024-07-18', completed: false },
    { id: 3, title: 'Practice coding problems', date: '2024-07-20', completed: true },
  ]);
  const [newReminder, setNewReminder] = useState({ title: '', date: '' });

  const addReminder = () => {
    if (newReminder.title && newReminder.date) {
      setReminders([
        ...reminders,
        {
          id: Date.now(),
          title: newReminder.title,
          date: newReminder.date,
          completed: false,
        },
      ]);
      setNewReminder({ title: '', date: '' });
    }
  };

  const toggleComplete = (id: number) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
      )
    );
  };

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Learning Reminders</h1>
        <p className="text-gray-600">Keep track of your learning schedule and never miss important study sessions.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Reminder</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="What do you need to study?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newReminder.title}
            onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
          />
          <input
            type="date"
            className="sm:w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newReminder.date}
            onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
          />
          <button
            onClick={addReminder}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Reminders</h2>
        {reminders.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No reminders yet. Add one to get started!</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {reminders.map((reminder) => (
              <li key={reminder.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reminder.completed}
                    onChange={() => toggleComplete(reminder.id)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                  />
                  <div>
                    <p className={`text-lg ${reminder.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {reminder.title}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <BellIcon className="h-4 w-4 mr-1" />
                      <span>{new Date(reminder.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}