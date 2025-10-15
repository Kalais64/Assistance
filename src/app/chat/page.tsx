'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { generateTextResponse, generateImageResponse } from '@/lib/gemini';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting message
  useEffect(() => {
    const initialMessage: Message = {
      id: 'initial',
      content: "Hello! I'm your personal learning assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  // Handle sending a message
  const handleSendMessage = async (content: string, type: 'text' | 'voice' | 'image', imageData?: string) => {
    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      let response;
      
      // Format chat history for Gemini API
      const history = messages
        .filter(msg => msg.id !== 'initial') // Skip initial greeting
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));
      
      // Handle different input types
      if (type === 'image' && imageData) {
        response = await generateImageResponse(content, imageData);
      } else {
        // For both text and voice (which is converted to text)
        response = await generateTextResponse(content, history);
      }
      
      // Create assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: response.text || "I'm sorry, I couldn't process that request. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };
      
      // Add assistant message to chat
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, something went wrong. Please try again later.",
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-blue-700">Chat with AI Learning Assistant</h2>
        <p className="text-sm text-gray-500">Ask questions, get explanations, or upload images for visual learning</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-bounce mr-1 h-2 w-2 bg-blue-600 rounded-full"></div>
              <div className="animate-bounce animation-delay-200 mr-1 h-2 w-2 bg-blue-600 rounded-full"></div>
              <div className="animate-bounce animation-delay-400 h-2 w-2 bg-blue-600 rounded-full"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto p-4">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>
  );
}