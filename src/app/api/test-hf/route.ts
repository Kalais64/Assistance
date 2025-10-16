import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";

export async function POST() {
  const token = process.env.HUGGING_FACE_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Token Hugging Face tidak ditemukan di server." }, { status: 500 });
  }

  try {
    console.log("--- MEMULAI TES HF DENGAN TOKEN ---");
    const hf = new HfInference(token);

    // Kita akan menggunakan model text-generation yang sangat umum
    const model = "google/flan-t5-xxl";
    const response = await hf.textGeneration({
      model: model,
      inputs: "Can you please write a short poem about a cat?",
    });

    console.log("--- TES HF BERHASIL ---", response);
    return NextResponse.json({ success: true, response });

  } catch (error: any) {
    console.error("--- TES HF GAGAL ---", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
