'use client';

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, Palette } from 'lucide-react';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesSectionProps {
  notes: Note[];
  onAddNote?: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote?: (id: string, note: Partial<Note>) => void;
  onDeleteNote?: (id: string) => void;
}

const noteColors = [
  { name: 'Yellow', value: 'bg-yellow-100 border-yellow-200', text: 'text-yellow-800' },
  { name: 'Blue', value: 'bg-blue-100 border-blue-200', text: 'text-blue-800' },
  { name: 'Green', value: 'bg-green-100 border-green-200', text: 'text-green-800' },
  { name: 'Pink', value: 'bg-pink-100 border-pink-200', text: 'text-pink-800' },
  { name: 'Purple', value: 'bg-purple-100 border-purple-200', text: 'text-purple-800' },
  { name: 'Gray', value: 'bg-gray-100 border-gray-200', text: 'text-gray-800' },
];

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    color: noteColors[0].value,
  });
  const [editNote, setEditNote] = useState({
    title: '',
    content: '',
    color: '',
  });

  const handleAddNote = () => {
    if (newNote.title.trim() && onAddNote) {
      onAddNote(newNote);
      setNewNote({ title: '', content: '', color: noteColors[0].value });
      setIsAddingNote(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditNote({
      title: note.title,
      content: note.content,
      color: note.color,
    });
  };

  const handleSaveEdit = () => {
    if (editingNoteId && editNote.title.trim() && onUpdateNote) {
      onUpdateNote(editingNoteId, {
        ...editNote,
        updatedAt: new Date(),
      });
      setEditingNoteId(null);
      setEditNote({ title: '', content: '', color: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditNote({ title: '', content: '', color: '' });
  };

  const getColorClasses = (colorValue: string) => {
    const colorObj = noteColors.find(c => c.value === colorValue);
    return colorObj || noteColors[0];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Notes</h3>
        <button
          onClick={() => setIsAddingNote(true)}
          className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 hover:bg-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {/* Add New Note Form */}
      {isAddingNote && (
        <div className={`p-4 rounded-lg border-2 ${newNote.color}`}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            
            {/* Color Picker */}
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-gray-500" />
              <div className="flex gap-1">
                {noteColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setNewNote({ ...newNote, color: color.value })}
                    className={`w-6 h-6 rounded-full border-2 ${color.value} ${
                      newNote.color === color.value ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddNote}
                className="inline-flex items-center gap-1 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-700/10 hover:bg-green-100 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote({ title: '', content: '', color: noteColors[0].value });
                }}
                className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => {
          const colorClasses = getColorClasses(note.color);
          const isEditing = editingNoteId === note.id;

          return (
            <div
              key={note.id}
              className={`p-4 rounded-lg border-2 ${note.color} transition-all hover:shadow-md`}
            >
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editNote.title}
                    onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <textarea
                    value={editNote.content}
                    onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                    rows={3}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  
                  {/* Color Picker for Edit */}
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-gray-500" />
                    <div className="flex gap-1">
                      {noteColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setEditNote({ ...editNote, color: color.value })}
                          className={`w-5 h-5 rounded-full border-2 ${color.value} ${
                            editNote.color === color.value ? 'ring-2 ring-indigo-500' : ''
                          }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10 hover:bg-green-100 transition-colors"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10 hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-medium ${colorClasses.text}`}>{note.title}</h4>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteNote?.(note.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm ${colorClasses.text} mb-2`}>{note.content}</p>
                  <p className="text-xs text-gray-500">
                    {note.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {notes.length === 0 && !isAddingNote && (
        <div className="text-center py-8 text-gray-500">
          <p>No notes yet. Click "Add Note" to create your first note!</p>
        </div>
      )}
    </div>
  );
};

export default NotesSection;