'use client';

import React, { useState, useEffect } from 'react';
import { Video, Download, Loader2, Play, Settings, X, Clock } from 'lucide-react';
import { geminiVideoService, VideoGenerationConfig, VideoOperation } from '@/lib/gemini-video';

interface VideoGeneratorProps {
  onVideoGenerated?: (video: VideoOperation) => void;
}

export default function VideoGenerator({ onVideoGenerated }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [operations, setOperations] = useState<VideoOperation[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<VideoGenerationConfig>({
    // Note: These parameters are currently disabled in the API
  });

  // Poll for operation updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedOperations = geminiVideoService.getAllOperations();
      setOperations(updatedOperations);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const { operationId, operation } = await geminiVideoService.generateVideo(prompt, config);
      setOperations(prev => [operation, ...prev]);
      onVideoGenerated?.(operation);
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Failed to start video generation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (operation: VideoOperation) => {
    if (!operation.video?.url) return;
    
    try {
      await geminiVideoService.downloadVideo(operation.video.url, `generated-video-${operation.id}.mp4`);
    } catch (error) {
      console.error('Error downloading video:', error);
      alert('Failed to download video.');
    }
  };

  const clearVideos = () => {
    setOperations([]);
    geminiVideoService.cleanup();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'running': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Play className="w-4 h-4" />;
      case 'failed': return <X className="w-4 h-4" />;
      case 'running': return <Loader2 className="w-4 h-4 animate-spin" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Video className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">AI Video Generator</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          {operations.length > 0 && (
            <button
              onClick={clearVideos}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Settings Panel - currently disabled */}
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Generation Settings</h3>
          <p className="text-sm text-gray-600">
            Advanced video generation settings are currently not available in this API version.
          </p>
        </div>
      )}

      {/* Prompt Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Describe the video you want to generate
        </label>
        <div className="flex gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A close up of two people staring at a cryptic drawing on a wall, torchlight flickering"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Video className="w-5 h-5" />
            )}
            {isGenerating ? 'Starting...' : 'Generate'}
          </button>
        </div>
      </div>

      {/* Video Operations */}
      {operations.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Video Generation Queue</h3>
          <div className="space-y-4">
            {operations.map((operation) => (
              <div key={operation.id} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`flex items-center gap-1 text-sm font-medium ${getStatusColor(operation.status)}`}>
                        {getStatusIcon(operation.status)}
                        {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {operation.video?.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {operation.video?.prompt}
                    </p>
                  </div>
                  {operation.status === 'completed' && operation.video?.url && (
                    <button
                      onClick={() => handleDownload(operation)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                {operation.status === 'running' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Generating video...</span>
                      <span>{Math.round(operation.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${operation.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Video Player */}
                {operation.status === 'completed' && operation.video?.url && (
                  <div className="mt-3">
                    <video
                      controls
                      className="w-full max-w-md rounded-lg"
                      poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHBvbHlnb24gcG9pbnRzPSIxNTAsMTEyLjUgMjUwLDc1IDI1MCwxNTAiIGZpbGw9IiNmZmYiLz48L3N2Zz4="
                    >
                      <source src={operation.video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* Error State */}
                {operation.status === 'failed' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      Video generation failed. Please try again with a different prompt.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {operations.length === 0 && !isGenerating && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No videos generated yet</h3>
          <p className="text-gray-500">Enter a prompt above to generate your first AI video</p>
        </div>
      )}
    </div>
  );
}