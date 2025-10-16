import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Gemini API client with proper error handling
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

try {
  genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
}

// Safety settings to comply with Gemini API requirements
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Get the generative model with validation
export const getGeminiModel = () => {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add your API key to .env.local file.');
  }
  if (!genAI) {
    throw new Error('Failed to initialize Gemini API client. Please check your connection and API key.');
  }
  // GUNAKAN: Model 'gemini-flash-lite-latest' yang lebih baru dan cepat.
  return genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    safetySettings 
  });
};

// Get the vision model for image processing with validation
export const getGeminiVisionModel = () => {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add your API key to .env.local file.');
  }
  if (!genAI) {
    throw new Error('Failed to initialize Gemini API client. Please check your connection and API key.');
  }
  // GUNAKAN: Model 'gemini-flash-lite-latest' juga bisa menangani gambar (multimodal).
  return genAI.getGenerativeModel({ 
    model: 'gemini-flash-lite-latest',
    safetySettings 
  });
};

// Generate text response from Gemini
export async function generateTextResponse(prompt: string, history: any[] = []) {
  try {
    const model = getGeminiModel();
    
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    return { text, error: null };
  } catch (error) {
    console.error('Error generating text response:', error);
    return { 
      text: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Generate response from image
export async function generateImageResponse(prompt: string, imageUrl: string) {
  try {
    const model = getGeminiVisionModel();
    
    const imageParts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageUrl.split(',')[1] // Extract base64 data
        }
      }
    ];

    const result = await model.generateContent(imageParts);
    const response = await result.response;
    const text = response.text();
    
    return { text, error: null };
  } catch (error) {
    console.error('Error generating image response:', error);
    return { 
      text: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}