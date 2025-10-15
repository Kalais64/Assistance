'use client';

import { useState } from 'react';
import { PlayIcon, DocumentTextIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

interface MediaItem {
  id: number;
  title: string;
  type: 'video' | 'document';
  thumbnail: string;
  duration?: string;
  category: string;
}

export default function MediaPage() {
  const [mediaItems] = useState<MediaItem[]>([
    {
      id: 1,
      title: 'Introduction to JavaScript',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/300x180/2563eb/FFFFFF?text=JavaScript',
      duration: '15:30',
      category: 'Programming'
    },
    {
      id: 2,
      title: 'React Fundamentals',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/300x180/2563eb/FFFFFF?text=React',
      duration: '22:45',
      category: 'Web Development'
    },
    {
      id: 3,
      title: 'Python Data Structures Guide',
      type: 'document',
      thumbnail: 'https://via.placeholder.com/300x180/2563eb/FFFFFF?text=Python',
      category: 'Programming'
    },
    {
      id: 4,
      title: 'Machine Learning Basics',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/300x180/2563eb/FFFFFF?text=ML',
      duration: '34:10',
      category: 'Data Science'
    },
    {
      id: 5,
      title: 'CSS Grid Layout Tutorial',
      type: 'document',
      thumbnail: 'https://via.placeholder.com/300x180/2563eb/FFFFFF?text=CSS',
      category: 'Web Development'
    },
    {
      id: 6,
      title: 'Database Design Principles',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/300x180/2563eb/FFFFFF?text=DB',
      duration: '28:15',
      category: 'Database'
    }
  ]);

  const [filter, setFilter] = useState('all');
  
  const filteredMedia = filter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === filter);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Learning Media</h1>
        <p className="text-gray-600">Access educational videos and documents to enhance your learning experience.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`}
        >
          All Media
        </button>
        <button 
          onClick={() => setFilter('video')}
          className={`px-4 py-2 rounded-full flex items-center ${filter === 'video' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`}
        >
          <PlayIcon className="h-4 w-4 mr-1" /> Videos
        </button>
        <button 
          onClick={() => setFilter('document')}
          className={`px-4 py-2 rounded-full flex items-center ${filter === 'document' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`}
        >
          <DocumentTextIcon className="h-4 w-4 mr-1" /> Documents
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="relative h-48 bg-blue-100">
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-600 bg-opacity-80 rounded-full p-3">
                    <PlayIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {item.category}
                </span>
                {item.type === 'video' && (
                  <span className="ml-2 text-xs text-gray-500 flex items-center">
                    <VideoCameraIcon className="h-3 w-3 mr-1" />
                    {item.duration}
                  </span>
                )}
                {item.type === 'document' && (
                  <span className="ml-2 text-xs text-gray-500 flex items-center">
                    <DocumentTextIcon className="h-3 w-3 mr-1" />
                    Document
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                {item.type === 'video' ? 'Watch Now' : 'Read Now'} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}