import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { imageProvider } from '@/lib/ai/image-provider';
import { sanitizePromptInput, checkRateLimit } from '@/lib/utils/security';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const rate = checkRateLimit(`gen-img:${user.id}`, 20);
    if (!rate.allowed) return NextResponse.json({ error: 'Rate limit reached' }, { status: 429 });

    const { prompt, type = 'scene', eraId, role } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    const cleanPrompt = sanitizePromptInput(prompt);
    let result;

    if (type === 'portrait') {
      result = await imageProvider.generateCharacterPortrait(cleanPrompt, role);
    } else if (type === 'poster') {
      result = await imageProvider.generateMoviePosterArtwork(cleanPrompt);
    } else {
      result = await imageProvider.generateSceneImage(cleanPrompt, eraId);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
