import { HfInference } from "@huggingface/inference";

// Model yang akan kita gunakan
const VIDEO_GENERATION_MODEL = "cerspense/zeroscope-v2-xl";

/**
 * Fungsi ini sekarang menerima instance HfInference yang sudah diinisialisasi.
 * @param hf Instance dari HfInference.
 * @param prompt Skrip teks untuk video.
 * @returns Blob yang berisi data video.
 */
export async function generateVideoFromHuggingFace(hf: HfInference, prompt: string): Promise<Blob> {
  console.log("Memulai pembuatan video dengan model:", VIDEO_GENERATION_MODEL);

  try {
    const videoBlob = await hf.textToVideo({
      model: VIDEO_GENERATION_MODEL,
      inputs: prompt,
      parameters: {
        max_inference_steps: 25,
        num_frames: 24,
      }
    });

    console.log("Berhasil menerima blob video dari Hugging Face.");
    return videoBlob;

  } catch (error: any) {
    console.error("Hugging Face Inference error:", error);
    
    if (error.message.includes('is currently loading')) {
        throw new Error(`Model sedang dimuat. Coba lagi dalam beberapa saat. Estimasi waktu: ${error.estimated_time || 'satu menit'}.`);
    }
    
    throw new Error(error.message || "Terjadi kesalahan tidak dikenal pada API Hugging Face.");
  }
}

