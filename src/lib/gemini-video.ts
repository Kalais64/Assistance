import { GoogleGenerativeAI } from '@google/generative-ai';

export interface VideoGenerationConfig {
  // Note: These parameters may not be supported in current API version
  // duration?: number; // in seconds
  // aspectRatio?: '16:9' | '9:16' | '1:1';
  // quality?: 'standard' | 'high';
}

export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  status: 'generating' | 'completed' | 'failed';
  progress?: number;
}

export interface VideoOperation {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  video?: GeneratedVideo;
}

class GeminiVideoService {
  private client: GoogleGenerativeAI;
  private operations: Map<string, VideoOperation> = new Map();

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateVideo(
    prompt: string,
    config: VideoGenerationConfig = {}
  ): Promise<{ operationId: string; operation: VideoOperation }> {
    try {
      const operationId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create initial operation
      const operation: VideoOperation = {
        id: operationId,
        status: 'pending',
        progress: 0
      };
      
      this.operations.set(operationId, operation);
      
      // Start mock video generation process
      this.simulateVideoGeneration(operationId, prompt);
      
      return { operationId, operation };
    } catch (error) {
      console.error('Error starting video generation:', error);
      throw new Error(`Failed to start video generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async simulateVideoGeneration(operationId: string, prompt: string): Promise<void> {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    try {
      // Update to running
      operation.status = 'running';
      operation.progress = 10;

      // Simulate progress updates
      const progressSteps = [25, 50, 75, 90];
      for (const progress of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        operation.progress = progress;
      }

      // Generate mock video (placeholder)
      const videoUrl = this.generateMockVideoUrl(prompt);
      
      const video: GeneratedVideo = {
        id: `video_${Date.now()}`,
        url: videoUrl,
        prompt,
        timestamp: new Date(),
        status: 'completed',
        progress: 100
      };

      operation.status = 'completed';
      operation.progress = 100;
      operation.video = video;

    } catch (error) {
      console.error('Error in video generation simulation:', error);
      operation.status = 'failed';
      operation.progress = 0;
    }
  }

  private generateMockVideoUrl(prompt: string): string {
    // Create a more detailed SVG animation that reflects the prompt
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const svg = `
      <svg width="640" height="360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="videoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2d2d2d;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#videoGrad)"/>
        
        <!-- Video frame border -->
        <rect x="20" y="20" width="600" height="320" rx="10" fill="none" stroke="${color}" stroke-width="2" opacity="0.5"/>
        
        <!-- Title area -->
        <rect x="40" y="40" width="560" height="80" rx="5" fill="${color}" opacity="0.1"/>
        
        <!-- Main title -->
        <text x="320" y="70" font-family="Arial" font-size="20" fill="#fff" text-anchor="middle" font-weight="bold">
          AI Generated Video
        </text>
        
        <!-- Prompt display -->
        <text x="320" y="100" font-family="Arial" font-size="16" fill="${color}" text-anchor="middle">
          "${prompt}"
        </text>
        
        <!-- Content area with prompt-based visuals -->
        ${this.getVideoPromptVisuals(prompt, color)}
        
        <!-- Play button overlay -->
        <circle cx="320" cy="220" r="40" fill="${color}" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite"/>
        </circle>
        <polygon points="305,205 305,235 335,220" fill="white"/>
        
        <!-- Progress bar -->
        <rect x="60" y="300" width="520" height="4" rx="2" fill="#333"/>
        <rect x="60" y="300" width="260" height="4" rx="2" fill="${color}">
          <animate attributeName="width" values="0;520;0" dur="4s" repeatCount="indefinite"/>
        </rect>
        
        <!-- Time indicator -->
        <text x="60" y="325" font-family="Arial" font-size="12" fill="#ccc">0:00</text>
        <text x="560" y="325" font-family="Arial" font-size="12" fill="#ccc">0:05</text>
        
        <!-- Footer -->
        <text x="320" y="350" font-family="Arial" font-size="10" fill="#666" text-anchor="middle">
          Mock Video Generation - Prompt: "${prompt.substring(0, 40)}${prompt.length > 40 ? '...' : ''}"
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  private getVideoPromptVisuals(prompt: string, color: string): string {
    const lowerPrompt = prompt.toLowerCase();
    let visuals = '';
    
    // Add visual elements based on prompt content
    if (lowerPrompt.includes('cartoon') || lowerPrompt.includes('animation') || lowerPrompt.includes('animated')) {
      visuals += `
        <!-- Cartoon character -->
        <circle cx="200" cy="180" r="25" fill="${color}" opacity="0.7">
          <animate attributeName="cy" values="180;170;180" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="190" cy="175" r="3" fill="white"/>
        <circle cx="210" cy="175" r="3" fill="white"/>
        <path d="M 185 185 Q 200 195 215 185" stroke="white" stroke-width="2" fill="none"/>
        
        <!-- Bouncing elements -->
        <rect x="400" y="160" width="20" height="20" rx="5" fill="${color}" opacity="0.6">
          <animate attributeName="y" values="160;140;160" dur="1s" repeatCount="indefinite"/>
        </rect>
      `;
    } else if (lowerPrompt.includes('nature') || lowerPrompt.includes('landscape') || lowerPrompt.includes('outdoor')) {
      visuals += `
        <!-- Mountains -->
        <polygon points="150,200 200,140 250,200" fill="${color}" opacity="0.6"/>
        <polygon points="220,200 270,150 320,200" fill="${color}" opacity="0.4"/>
        
        <!-- Sun -->
        <circle cx="500" cy="160" r="20" fill="#FFD700" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.5;0.8" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        <!-- Clouds -->
        <ellipse cx="450" cy="140" rx="30" ry="15" fill="white" opacity="0.6">
          <animate attributeName="cx" values="450;470;450" dur="4s" repeatCount="indefinite"/>
        </ellipse>
      `;
    } else if (lowerPrompt.includes('tech') || lowerPrompt.includes('digital') || lowerPrompt.includes('cyber')) {
      visuals += `
        <!-- Digital elements -->
        <rect x="180" y="160" width="15" height="15" fill="${color}" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="0.8s" repeatCount="indefinite"/>
        </rect>
        <rect x="220" y="180" width="12" height="12" fill="${color}" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.2s" repeatCount="indefinite"/>
        </rect>
        <rect x="260" y="170" width="18" height="18" fill="${color}" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1s" repeatCount="indefinite"/>
        </rect>
        
        <!-- Circuit lines -->
        <line x1="200" y1="170" x2="250" y2="170" stroke="${color}" stroke-width="2" opacity="0.5">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
        </line>
      `;
    } else {
      // Generic video content
      visuals += `
        <!-- Generic shapes -->
        <circle cx="200" cy="180" r="15" fill="${color}" opacity="0.6">
          <animate attributeName="r" values="15;25;15" dur="2s" repeatCount="indefinite"/>
        </circle>
        <rect x="300" y="165" width="30" height="30" rx="5" fill="${color}" opacity="0.5">
          <animate attributeName="width" values="30;40;30" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="height" values="30;40;30" dur="1.8s" repeatCount="indefinite"/>
        </rect>
        <polygon points="450,170 470,190 430,190" fill="${color}" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.3s" repeatCount="indefinite"/>
        </polygon>
      `;
    }
    
    return visuals;
  }

  getOperation(operationId: string): VideoOperation | undefined {
    return this.operations.get(operationId);
  }

  getAllOperations(): VideoOperation[] {
    return Array.from(this.operations.values());
  }

  async downloadVideo(videoUrl: string, filename: string): Promise<void> {
    try {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading video:', error);
      throw new Error('Failed to download video');
    }
  }

  cleanup(): void {
    // Clear old operations (keep only last 10)
    const operations = Array.from(this.operations.entries());
    if (operations.length > 10) {
      const toKeep = operations.slice(-10);
      this.operations.clear();
      toKeep.forEach(([id, op]) => this.operations.set(id, op));
    }
  }
}

export const geminiVideoService = new GeminiVideoService();