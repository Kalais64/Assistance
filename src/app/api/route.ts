import { NextResponse, NextRequest } from 'next/server';
import { generateVideoFromHuggingFace } from '@/lib/huggingface-video';
import { storage } from '@/lib/firebase';
import { learningModulesService } from '@/lib/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleId, script } = body;

    // --- LANGKAH DEBUGGING ---
    const token = process.env.HUGGING_FACE_TOKEN;
    console.log(`[API Route Debug] Token Ditemukan: ${!!token}, 5 Karakter Pertama: ${token?.substring(0, 5)}...`);
    // --- AKHIR LANGKAH DEBUGGING ---

    if (!moduleId || !script) {
      return NextResponse.json({ error: 'Missing moduleId or script' }, { status: 400 });
    }

    // 1. Generate video from Hugging Face
    const videoBlob = await generateVideoFromHuggingFace(script);

    // 2. Upload video to Firebase Storage
    const videoFileName = `${moduleId}-${Date.now()}.mp4`;
    const storageRef = ref(storage, `learning-videos/${videoFileName}`);
    const uploadResult = await uploadBytes(storageRef, videoBlob);
    const videoUrl = await getDownloadURL(uploadResult.ref);

    // 3. Update Firestore with the new video URL
    await learningModulesService.updateLearningModule(moduleId, { 
      generatedVideoUrl: videoUrl 
    });

    return NextResponse.json({ videoUrl });

  } catch (error: any) {
    console.error('[API/generate-video] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate video' }, { status: 500 });
  }
}