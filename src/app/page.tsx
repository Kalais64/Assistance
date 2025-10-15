'use client';

import { useState, useEffect } from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RecommendationList from '@/components/dashboard/RecommendationList';
import ReminderList from '@/components/dashboard/ReminderList';
import NotesSection from '@/components/dashboard/NotesSection';
import NotificationPopup from '@/components/ui/NotificationPopup';
import ImageGenerator from '@/components/ai/ImageGenerator';
import VideoGenerator from '@/components/ai/VideoGenerator';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { notesService, remindersService, type FirebaseReminder } from '@/lib/firestore';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Note } from '@/components/dashboard/NotesSection';

// Sample data for demonstration
const sampleRecommendations = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    type: 'lesson',
    description: 'Learn the basics of machine learning algorithms',
    url: 'https://www.coursera.org/learn/machine-learning',
  },
  {
    id: '2',
    title: 'JavaScript Quiz',
    type: 'quiz',
    description: 'Test your knowledge of JavaScript fundamentals',
    url: 'https://www.w3schools.com/js/js_quiz.asp',
  },
  {
    id: '3',
    title: 'Effective Time Management',
    type: 'soft-skill',
    description: 'Techniques to improve your productivity',
    url: 'https://www.mindtools.com/pages/main/newMN_HTE.htm',
  },
] as const;

const sampleReminders = [
  {
    id: '1',
    title: 'Complete Python Assignment',
    datetime: '2023-06-15T14:00:00',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Review React Hooks',
    datetime: '2023-06-16T10:00:00',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Practice Typing',
    datetime: '2023-06-17T09:00:00',
    priority: 'low',
  },
] as const;

export default function Home() {
  const { notifications, removeNotification, showSuccess, showInfo, showError } = useNotifications();
  const { user } = useAuth();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [reminders, setReminders] = useState<FirebaseReminder[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isLoadingReminders, setIsLoadingReminders] = useState(true);

  // Load notes and reminders when user is authenticated
  useEffect(() => {
    if (!user) {
      // If no user, use sample data
      setNotes([
        {
          id: '1',
          title: 'Study Goals',
          content: 'Complete machine learning course by end of month. Focus on practical applications.',
          color: 'bg-yellow-100 border-yellow-200',
          createdAt: new Date('2023-06-01'),
          updatedAt: new Date('2023-06-01'),
        },
        {
          id: '2',
          title: 'Project Ideas',
          content: 'Build a personal portfolio website using React and Next.js. Include dark mode toggle.',
          color: 'bg-blue-100 border-blue-200',
          createdAt: new Date('2023-06-02'),
          updatedAt: new Date('2023-06-02'),
        },
      ]);
      setReminders([
        {
          id: '1',
          userId: 'sample',
          title: 'Complete Python Assignment',
          datetime: '2023-06-15T14:00:00',
          priority: 'high',
          completed: false,
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any,
        },
        {
          id: '2',
          userId: 'sample',
          title: 'Review React Hooks',
          datetime: '2023-06-16T10:00:00',
          priority: 'medium',
          completed: false,
          createdAt: { toDate: () => new Date() } as any,
          updatedAt: { toDate: () => new Date() } as any,
        },
      ]);
      setIsLoadingNotes(false);
      setIsLoadingReminders(false);
      return;
    }

    // Subscribe to real-time updates for notes
    const unsubscribeNotes = notesService.subscribeToNotes(user.uid, (updatedNotes) => {
      setNotes(updatedNotes);
      setIsLoadingNotes(false);
    });

    // Subscribe to real-time updates for reminders
    const unsubscribeReminders = remindersService.subscribeToReminders(user.uid, (updatedReminders) => {
      setReminders(updatedReminders);
      setIsLoadingReminders(false);
    });

    return () => {
      unsubscribeNotes();
      unsubscribeReminders();
    };
  }, [user]);

  const handleStartRecommendation = (recommendation: any) => {
    showSuccess('Recommendation Started', `Opening ${recommendation.title}...`);
  };

  const handleCompleteReminder = async (reminderId: string) => {
    if (!user) {
      // For non-authenticated users, just update local state
      setReminders(prev => 
        prev.map(reminder => 
          reminder.id === reminderId 
            ? { ...reminder, completed: true }
            : reminder
        )
      );
      showSuccess('Reminder Completed', 'Great job! Keep up the good work.');
      return;
    }

    try {
      await remindersService.updateReminder(reminderId, { completed: true });
      showSuccess('Reminder Completed', 'Great job! Keep up the good work.');
    } catch (error) {
      showError('Error', 'Failed to update reminder. Please try again.');
    }
  };

  const handleSnoozeReminder = (reminderId: string, minutes: number) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      showInfo('Reminder Snoozed', `${reminder.title} snoozed for ${minutes} minutes.`);
    }
  };

  const handleAddNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      // For non-authenticated users, just update local state
      const newNote: Note = {
        ...noteData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes(prev => [...prev, newNote]);
      showSuccess('Note Added', 'Your note has been saved successfully.');
      return;
    }

    try {
      await notesService.addNote(user.uid, noteData);
      showSuccess('Note Added', 'Your note has been saved successfully.');
    } catch (error) {
      showError('Error', 'Failed to add note. Please try again.');
    }
  };

  const handleUpdateNote = async (id: string, noteData: Partial<Note>) => {
    if (!user) {
      // For non-authenticated users, just update local state
      setNotes(prev => 
        prev.map(note => 
          note.id === id 
            ? { ...note, ...noteData, updatedAt: new Date() }
            : note
        )
      );
      showSuccess('Note Updated', 'Your changes have been saved.');
      return;
    }

    try {
      await notesService.updateNote(id, noteData);
      showSuccess('Note Updated', 'Your changes have been saved.');
    } catch (error) {
      showError('Error', 'Failed to update note. Please try again.');
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!user) {
      // For non-authenticated users, just update local state
      setNotes(prev => prev.filter(note => note.id !== id));
      showInfo('Note Deleted', 'Note has been removed.');
      return;
    }

    try {
      await notesService.deleteNote(id);
      showInfo('Note Deleted', 'Note has been removed.');
    } catch (error) {
      showError('Error', 'Failed to delete note. Please try again.');
    }
  };

  const handleImageGenerated = (image: any) => {
    showSuccess('Image Generated', 'Your AI image has been created successfully!');
  };

  const handleVideoGenerated = (video: any) => {
    showSuccess('Video Generation Started', 'Your AI video is being generated. This may take a few minutes.');
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Notification System */}
      <NotificationPopup 
        notifications={notifications} 
        onClose={removeNotification} 
      />

      {/* Simplified Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          Learning Dashboard
        </h1>
        <p className="text-gray-600">
          Your personalized learning experience
        </p>
      </div>

      {/* Simplified Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Simplified Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommendations */}
        <DashboardCard title="Recommended">
          <RecommendationList 
            recommendations={[...sampleRecommendations]} 
            onStartRecommendation={handleStartRecommendation}
          />
        </DashboardCard>

        {/* Reminders */}
        <DashboardCard title="Reminders">
          <ReminderList 
            reminders={reminders}
            onCompleteReminder={handleCompleteReminder}
            onSnoozeReminder={handleSnoozeReminder}
          />
        </DashboardCard>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <NotesSection
          notes={notes}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>

      {/* AI Generation Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Generator */}
        <ImageGenerator onImageGenerated={handleImageGenerated} />
        
        {/* Video Generator */}
        <VideoGenerator onVideoGenerated={handleVideoGenerated} />
      </div>

      {/* Simplified Progress Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Python Basics</span>
              <span className="text-blue-600">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Web Development</span>
              <span className="text-blue-600">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
