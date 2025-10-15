import React, { useState, useRef } from 'react';
import { MicrophoneIcon, PaperAirplaneIcon, PhotoIcon, StopIcon } from '@heroicons/react/24/outline';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text' | 'voice' | 'image', imageData?: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle text input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage('');
    }
  };

  // Handle voice recording
  const handleVoiceRecording = () => {
    if (!isRecording) {
      // Start recording logic would go here
      // This is a simplified implementation
      setIsRecording(true);
      
      // In a real implementation, we would use the Web Speech API
      // For now, we'll just simulate recording
      setTimeout(() => {
        setIsRecording(false);
        onSendMessage("Voice message transcription would appear here", 'voice');
      }, 3000);
    } else {
      // Stop recording logic
      setIsRecording(false);
    }
  };

  // Handle file selection for images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Read the file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Send image with optional message
  const handleSendImage = () => {
    if (imagePreview) {
      onSendMessage(message || 'Image uploaded', 'image', imagePreview);
      setImagePreview(null);
      setMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Cancel image upload
  const handleCancelImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-t border-gray-100 p-4 bg-white">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-4">
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-40 rounded-lg mx-auto" 
            />
            <button
              onClick={handleCancelImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSendImage}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Send Image
            </button>
          </div>
        </div>
      )}
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Chat input form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100"
        >
          <PhotoIcon className="h-6 w-6" />
        </button>
        
        <button
          type="button"
          onClick={handleVoiceRecording}
          className={`p-2 rounded-full ${
            isRecording 
              ? 'text-red-500 bg-red-100' 
              : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
          }`}
        >
          {isRecording ? (
            <StopIcon className="h-6 w-6" />
          ) : (
            <MicrophoneIcon className="h-6 w-6" />
          )}
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          type="submit"
          disabled={!message.trim() && !imagePreview}
          className={`p-2 rounded-full ${
            message.trim() || imagePreview
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
}