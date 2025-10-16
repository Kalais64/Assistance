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
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Note } from '@/components/dashboard/NotesSection';

export interface FirebaseNote extends Omit<Note, 'createdAt' | 'updatedAt'> {
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Antarmuka baru untuk Learning Modules
export interface FirebaseLearningModule {
  id?: string;
  userId: string;
  topic: string;
  grade: string;
  tutorialContent: string;
  quizData: string; // Akan disimpan sebagai JSON string
  videoScript: string;
  imageDescription: string;
  generatedImageUrl?: string; // Menyimpan URL gambar yang dihasilkan
  generatedVideoUrl?: string; // Menyimpan URL video yang dihasilkan
  createdAt: Timestamp;
}

export interface FirebaseReminder {
  id?: string;
  userId: string;
  title: string;
  datetime: Timestamp;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Notes CRUD operations
export const notesService = {
  // Add a new note
  async addNote(
    userId: string,
    noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
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
      return querySnapshot.docs.map((doc) => {
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
  async updateNote(
    noteId: string,
    updates: Partial<Omit<Note, 'id' | 'createdAt'>>
  ): Promise<void> {
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
  subscribeToNotes(
    userId: string,
    callback: (notes: Note[]) => void
  ): () => void {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const notes: Note[] = querySnapshot.docs.map((doc) => {
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
  },
};

// Reminders CRUD operations
export const remindersService = {
  // Add a new reminder
  async addReminder(
    userId: string,
    reminderData: Omit<FirebaseReminder, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'completed'>
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'reminders'), {
        ...reminderData,
        userId,
        completed: false,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding reminder:', error);
      throw new Error('Failed to add reminder');
    }
  },

  // Update a reminder
  async updateReminder(
    reminderId: string,
    updates: Partial<Omit<FirebaseReminder, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
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
  subscribeToReminders(
    userId: string,
    callback: (reminders: FirebaseReminder[]) => void
  ): () => void {
    const q = query(
      collection(db, 'reminders'),
      where('userId', '==', userId),
      orderBy('datetime', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const reminders: FirebaseReminder[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<FirebaseReminder, 'id'>),
      }));
      callback(reminders);
    });
  },
};

// Service baru untuk Learning Modules
export const learningModulesService = {
  // Menambah modul pembelajaran baru
  async addLearningModule(
    userId: string,
    moduleData: Omit<
      FirebaseLearningModule,
      'id' | 'userId' | 'createdAt' | 'generatedImageUrl' | 'generatedVideoUrl'
    >
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'learningModules'), {
        ...moduleData,
        userId,
        createdAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding learning module:', error);
      throw new Error('Failed to add learning module');
    }
  },

  // Fungsi baru untuk memperbarui modul (misalnya, setelah video dibuat)
  async updateLearningModule(
    moduleId: string,
    updates: Partial<FirebaseLearningModule>
  ): Promise<void> {
    try {
      const moduleRef = doc(db, 'learningModules', moduleId);
      await updateDoc(moduleRef, updates);
    } catch (error) {
      console.error('Error updating learning module:', error);
      throw new Error('Failed to update learning module');
    }
  },

  // Mendengarkan perubahan modul secara real-time
  subscribeToLearningModules(
    userId: string,
    callback: (modules: FirebaseLearningModule[]) => void
  ): () => void {
    const q = query(
      collection(db, 'learningModules'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const modules: FirebaseLearningModule[] = querySnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<FirebaseLearningModule, 'id'>),
        })
      );
      callback(modules);
    });
  },
};