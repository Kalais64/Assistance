import { getGeminiModel } from './gemini';

// Generate tutorial content for a specific topic and grade level
export async function generateTutorial(topic: string, grade: string): Promise<string> {
  try {
    const model = getGeminiModel();
    
    const prompt = `You are a friendly and enthusiastic teacher. Your goal is to explain topics to students in a simple, engaging, and easy-to-understand way. Use analogies and simple language. Do not use markdown. Explain the topic "${topic}" for a ${grade} student. The explanation should be concise, around 150-200 words.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating tutorial:', error);
    throw new Error('Failed to generate tutorial content');
  }
}

// Generate quiz questions for a specific topic and grade level
export async function generateQuiz(topic: string, grade: string): Promise<any[]> {
  try {
    const model = getGeminiModel();
    
    const prompt = `Create a 5-question multiple-choice quiz about "${topic}" for a ${grade} student. Each question must have exactly 4 options. Format your response as a JSON array with objects containing 'question', 'options' (array of 4 strings), and 'correctAnswer' (string matching one of the options).`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Membersihkan respons dari blok kode markdown
    const cleanedText = text.replace(/```json\n|```/g, '').trim();

    try {
      // Mencoba mengurai respons yang sudah dibersihkan sebagai JSON
      const parsedQuiz = JSON.parse(cleanedText);
      return Array.isArray(parsedQuiz) ? parsedQuiz : [];
    } catch (e) {
      console.error('Failed to parse quiz data:', e);
      // Jika penguraian gagal, coba ekstrak JSON dari teks
      const jsonMatch = cleanedText.match(/\\[[\\s\\S]*\\]/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          return Array.isArray(extractedJson) ? extractedJson : [];
        } catch {
          return [];
        }
      }
      return [];
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz content');
  }
}

// Generate image description for a topic
export async function generateImageDescription(topic: string, grade: string): Promise<string> {
  try {
    const model = getGeminiModel();
    
    const prompt = `Create a detailed description for an educational image about "${topic}" suitable for ${grade} students. The description should be visual and specific enough that it could be used to generate an image. Focus on educational elements that would help students understand the topic.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating image description:', error);
    throw new Error('Failed to generate image description');
  }
}

// Generate video script for a topic
export async function generateVideoScript(topic: string, grade: string): Promise<string> {
  try {
    const model = getGeminiModel();
    
    const prompt = `Create a short educational video script about "${topic}" for ${grade} students. The script should be engaging, clear, and educational. It should be around 200-300 words and divided into short paragraphs that could be narrated alongside images.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating video script:', error);
    throw new Error('Failed to generate video script');
  }
}