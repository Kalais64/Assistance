'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { remindersService, type FirebaseReminder } from '@/lib/firestore';
import { useNotifications } from '@/hooks/useNotifications';

interface Reminder {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export default function RemindersPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState({ title: '', date: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Load reminders when user is authenticated
  useEffect(() => {
    if (!user) {
      // If no user, use sample data
      setReminders([
        { id: '1', title: 'Complete JavaScript tutorial', date: '2024-07-15', completed: false },
        { id: '2', title: 'Review React concepts', date: '2024-07-18', completed: false },
        { id: '3', title: 'Practice coding problems', date: '2024-07-20', completed: true },
      ]);
      setIsLoading(false);
      return;
    }

    // Subscribe to real-time updates for reminders
    const unsubscribe = remindersService.subscribeToReminders(user.uid, (firebaseReminders) => {
      const formattedReminders = firebaseReminders.map(reminder => ({
        id: reminder.id!,
        title: reminder.title,
        date: reminder.datetime.split('T')[0], // Extract date part
        completed: reminder.completed,
      }));
      setReminders(formattedReminders);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addReminder = async () => {
    if (!newReminder.title || !newReminder.date) return;

    if (!user) {
      // For non-authenticated users, just update local state
      setReminders([
        ...reminders,
        {
          id: Date.now().toString(),
          title: newReminder.title,
          date: newReminder.date,
          completed: false,
        },
      ]);
      setNewReminder({ title: '', date: '' });
      showSuccess('Reminder Added', 'Your reminder has been saved.');
      return;
    }

    try {
      await remindersService.addReminder(user.uid, {
        title: newReminder.title,
        datetime: `${newReminder.date}T09:00:00`, // Default to 9 AM
        priority: 'medium',
        completed: false,
      });
      setNewReminder({ title: '', date: '' });
      showSuccess('Reminder Added', 'Your reminder has been saved.');
    } catch (error) {
      showError('Error', 'Failed to add reminder. Please try again.');
    }
  };

  const toggleComplete = async (id: string) => {
    if (!user) {
      // For non-authenticated users, just update local state
      setReminders(
        reminders.map((reminder) =>
          reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
        )
      );
      return;
    }

    try {
      const reminder = reminders.find(r => r.id === id);
      if (reminder) {
        await remindersService.updateReminder(id, { completed: !reminder.completed });
      }
    } catch (error) {
      showError('Error', 'Failed to update reminder. Please try again.');
    }
  };

  const deleteReminder = async (id: string) => {
    if (!user) {
      // For non-authenticated users, just update local state
      setReminders(reminders.filter((reminder) => reminder.id !== id));
      showSuccess('Reminder Deleted', 'Your reminder has been removed.');
      return;
    }

    try {
      await remindersService.deleteReminder(id);
      showSuccess('Reminder Deleted', 'Your reminder has been removed.');
    } catch (error) {
      showError('Error', 'Failed to delete reminder. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Learning Reminders</h1>
        <p className="text-gray-600">Keep track of your learning schedule and never miss important study sessions.</p>
        {user && <p className="text-sm text-green-600 mt-1">✓ Data synced to your account</p>}
        {!user && <p className="text-sm text-orange-600 mt-1">⚠ Sign in to save your reminders permanently</p>}
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
        {isLoading ? (
          <p className="text-gray-500 text-center py-6">Loading reminders...</p>
        ) : reminders.length === 0 ? (
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
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                  />
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {reminder.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <BellIcon className="h-4 w-4 mr-1" />
                      {new Date(reminder.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-600 hover:text-red-800 p-2"
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