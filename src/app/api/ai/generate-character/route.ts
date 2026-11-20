import { NextRequest, NextResponse } from 'next/server';
import { aiModelProvider } from '@/lib/ai/model-provider';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { checkRateLimit, sanitizePromptInput } from '@/lib/utils/security';
import { imageProvider } from '@/lib/ai/image-provider';
import { DataStore } from '@/lib/supabase/storage';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const rate = checkRateLimit(`gen-char:${user.id}`, 20);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 });
    }

    const body = await req.json();
    const eraName = sanitizePromptInput(body.eraName || 'Cyberpunk Future');
    const role = sanitizePromptInput(body.role || 'Time Traveller');
    const customSeed = sanitizePromptInput(body.customSeed || '');

    // 1. Generate Structured Profile from NVIDIA NIM
    const profile = await aiModelProvider.generateCharacter( { eraName, role, customSeed } );

    // 2. Generate portrait
    const portraitResult = await imageProvider.generateCharacterPortrait(profile.visual_prompt, profile.role);

    // 3. Save to user library
    const saved = await DataStore.saveCharacter({
      ...profile,
      user_id: user.id,
      image_url: portraitResult.imageUrl,
    });

    return NextResponse.json({
      character: saved,
      image_meta: portraitResult,
    });
  } catch (err: any) {
    console.error('generate-character error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate character' }, { status: 500 });
  }
}
