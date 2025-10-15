import React from 'react';

interface Reminder {
  id: string;
  title: string;
  datetime: string;
  priority: 'low' | 'medium' | 'high';
}

interface ReminderListProps {
  reminders: Reminder[];
}

export default function ReminderList({ reminders }: ReminderListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-my-5 divide-y divide-gray-200">
        {reminders.map((reminder) => (
          <li key={reminder.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center justify-center h-10 w-10 rounded-md ${getPriorityColor(reminder.priority)}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{reminder.title}</p>
                <p className="text-sm text-gray-500 truncate">
                  {new Date(reminder.datetime).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                >
                  Complete
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10"
                >
                  Snooze
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}