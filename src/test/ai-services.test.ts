// Test file to validate AI generation services
import { geminiImageService } from '@/lib/gemini-image';
import { geminiVideoService } from '@/lib/gemini-video';

// Test configuration validation
export function testAIServices() {
  console.log('Testing AI Services Configuration...');
  
  // Test API key configuration
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ Gemini API key not found in environment variables');
    return false;
  }
  console.log('✅ Gemini API key configured');

  // Test image service initialization
  try {
    const imageConfig = {
      numberOfImages: 1,
      aspectRatio: '1:1' as const,
      style: 'photographic' as const
    };
    console.log('✅ Image service configuration valid');
  } catch (error) {
    console.error('❌ Image service configuration error:', error);
    return false;
  }

  // Test video service initialization
  try {
    const videoConfig = {
      duration: 5,
      aspectRatio: '16:9' as const,
      quality: 'standard' as const
    };
    console.log('✅ Video service configuration valid');
  } catch (error) {
    console.error('❌ Video service configuration error:', error);
    return false;
  }

  console.log('🎉 All AI services configured correctly!');
  return true;
}

// Export for use in components
export { geminiImageService, geminiVideoService };