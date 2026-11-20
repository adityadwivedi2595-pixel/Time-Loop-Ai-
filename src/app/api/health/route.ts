import { NextResponse } from 'next/server';
import { nvidiaClient } from '@/lib/ai/nvidia-client';
import { DataStore } from '@/lib/supabase/storage';
import { imageProvider } from '@/lib/ai/image-provider';

export async function GET() {
  const modelVerification = await nvidiaClient.verifyModelAccess();
  const eras = await DataStore.getEras();

  return NextResponse.json({
    status: 'ok',
    app: 'TIMELOOP AI – Entertainment Edition',
    version: '1.0.0',
    nvidia_nim: {
      configured: nvidiaClient.isConfigured(),
      default_model: nvidiaClient.getDefaultModel(),
      verification: modelVerification,
    },
    database: {
      live_supabase: DataStore.hasLiveSupabase(),
      loaded_eras: eras.length,
    },
    image_provider: {
      configured: imageProvider.generateCharacterPortrait !== undefined,
    },
    timestamp: new Date().toISOString(),
  });
}
