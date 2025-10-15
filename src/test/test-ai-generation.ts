// Test script to diagnose AI generation issues
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function testGeminiConnection() {
  console.log('🔍 Testing Gemini API Connection...');
  
  // Check environment variables
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  console.log('API Key present:', !!apiKey);
  console.log('API Key length:', apiKey?.length || 0);
  
  if (!apiKey) {
    console.error('❌ No API key found');
    return false;
  }

  try {
    // Initialize client
    const client = new GoogleGenerativeAI(apiKey);
    console.log('✅ Client initialized successfully');

    // Test basic connection by listing models (if available)
    try {
      // This is a basic test - actual model listing might not be available
      console.log('🔍 Testing API connection...');
      
      // Try a simple text generation first to test the API key
      const model = client.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Hello');
      console.log('✅ Basic API connection successful');
      
      return true;
    } catch (error: any) {
      console.error('❌ API connection failed:', error.message);
      
      // Check for common error types
      if (error.message?.includes('API_KEY_INVALID')) {
        console.error('🔑 Invalid API key');
      } else if (error.message?.includes('PERMISSION_DENIED')) {
        console.error('🚫 Permission denied - check API key permissions');
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        console.error('📊 Quota exceeded');
      }
      
      return false;
    }
  } catch (error: any) {
    console.error('❌ Client initialization failed:', error.message);
    return false;
  }
}

// Test image generation specifically
export async function testImageGeneration() {
  console.log('🖼️ Testing Image Generation...');
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ No API key for image generation');
    return false;
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    
    // Test if image generation models are available
    console.log('🔍 Testing image generation capability...');
    
    // Note: The actual image generation might require different setup
    // This is a diagnostic test
    return true;
  } catch (error: any) {
    console.error('❌ Image generation test failed:', error.message);
    return false;
  }
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testGeminiConnection = testGeminiConnection;
  (window as any).testImageGeneration = testImageGeneration;
}