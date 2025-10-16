// Service untuk berinteraksi dengan Hugging Face Inference API untuk generasi video
import { HfInference } from "@huggingface/inference";

// Inisialisasi Hugging Face Inference client
const HUGGING_FACE_API_TOKEN = process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN;
const hf = new HfInference(HUGGING_FACE_API_TOKEN);

// URL model text-to-video di Hugging Face.
const VIDEO_GENERATION_MODEL = "cerspense/zeroscope-v2-xl";

/**
 * Memulai generasi video dari sebuah prompt (skrip) menggunakan Hugging Face Inference Client.
 * Library ini akan menangani proses pemanggilan API yang kompleks secara otomatis.
 * @param prompt Skrip teks untuk video.
 * @returns Blob yang berisi data video.
 */
export async function generateVideoFromHuggingFace(prompt: string): Promise<Blob> {
  if (!HUGGING_FACE_API_TOKEN) {
    throw new Error("Hugging Face API token is not configured. Please add NEXT_PUBLIC_HUGGING_FACE_TOKEN to your .env file.");
  }

  console.log("Starting video generation with Hugging Face Inference Client for prompt:", prompt);

  try {
    // Menggunakan metode textToVideo dari library resmi
    const videoBlob = await hf.textToVideo({
      model: VIDEO_GENERATION_MODEL,
      inputs: prompt,
      parameters: {
        max_inference_steps: 25, // Parameter bisa disesuaikan
        num_frames: 24,
      }
    });

    console.log("Successfully received video blob from Hugging Face.");
    return videoBlob;

  } catch (error: any) {
    console.error("Hugging Face Inference error:", error);
    
    // Memberikan pesan error yang lebih informatif kepada pengguna
    if (error.message.includes('is currently loading')) {
        throw new Error(`The model is currently loading. Please wait a moment and try again. Estimated time: ${error.estimated_time || 'a minute'}.`);
    }
    
    throw new Error(error.message || "An unknown error occurred with the Hugging Face API.");
  }
}