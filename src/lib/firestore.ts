import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Note } from '@/components/dashboard/NotesSection';

export interface FirebaseNote extends Omit<Note, 'createdAt' | 'updatedAt'> {
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseReminder {
  id?: string;
  userId: string;
  title: string;
  datetime: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Notes CRUD operations
export const notesService = {
  // Add a new note
  async addNote(userId: string, noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'notes'), {
        ...noteData,
        userId,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding note:', error);
      throw new Error('Failed to add note');
    }
  },

  // Get all notes for a user
  async getNotes(userId: string): Promise<Note[]> {
    try {
      const q = query(
        collection(db, 'notes'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as FirebaseNote;
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          color: data.color,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      });
    } catch (error) {
      console.error('Error getting notes:', error);
      throw new Error('Failed to get notes');
    }
  },

  // Update a note
  async updateNote(noteId: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating note:', error);
      throw new Error('Failed to update note');
    }
  },

  // Delete a note
  async deleteNote(noteId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw new Error('Failed to delete note');
    }
  },

  // Listen to notes changes in real-time
  subscribeToNotes(userId: string, callback: (notes: Note[]) => void): () => void {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const notes: Note[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as FirebaseNote;
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          color: data.color,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        };
      });
      callback(notes);
    });
  }
};

// Reminders CRUD operations
export const remindersService = {
  // Add a new reminder
  async addReminder(userId: string, reminderData: Omit<FirebaseReminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'reminders'), {
        ...reminderData,
        userId,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding reminder:', error);
      throw new Error('Failed to add reminder');
    }
  },

  // Get all reminders for a user
  async getReminders(userId: string): Promise<FirebaseReminder[]> {
    try {
      const q = query(
        collection(db, 'reminders'),
        where('userId', '==', userId),
        orderBy('datetime', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<FirebaseReminder, 'id'>
      }));
    } catch (error) {
      console.error('Error getting reminders:', error);
      throw new Error('Failed to get reminders');
    }
  },

  // Update a reminder
  async updateReminder(reminderId: string, updates: Partial<Omit<FirebaseReminder, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    try {
      const reminderRef = doc(db, 'reminders', reminderId);
      await updateDoc(reminderRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw new Error('Failed to update reminder');
    }
  },

  // Delete a reminder
  async deleteReminder(reminderId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'reminders', reminderId));
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw new Error('Failed to delete reminder');
    }
  },

  // Listen to reminders changes in real-time
  subscribeToReminders(userId: string, callback: (reminders: FirebaseReminder[]) => void): () => void {
    const q = query(
      collection(db, 'reminders'),
      where('userId', '==', userId),
      orderBy('datetime', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const reminders: FirebaseReminder[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<FirebaseReminder, 'id'>
      }));
      callback(reminders);
    });
  }
};