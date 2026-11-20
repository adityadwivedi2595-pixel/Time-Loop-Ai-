import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { aiModelProvider } from '@/lib/ai/model-provider';
import { imageProvider } from '@/lib/ai/image-provider';
import { sanitizePromptInput } from '@/lib/utils/security';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const body = await req.json();

    const storyTitle = sanitizePromptInput(body.storyTitle || 'Echoes of Chronos');
    const genre = sanitizePromptInput(body.genre || 'Sci-Fi Adventure');
    const eraName = sanitizePromptInput(body.eraName || 'Cyberpunk Future');
    const character = sanitizePromptInput(body.character || 'The Time Navigator');
    const tagline = sanitizePromptInput(body.tagline || 'History remembers the brave.');

    // 1. Generate Poster Prompt & Typography specs
    const promptData = await aiModelProvider.generatePosterPrompt({
      storyTitle,
      genre,
      eraName,
      character,
      tagline,
    });

    // 2. Generate artwork (without embedded text for crisp overlay)
    const artworkResult = await imageProvider.generateMoviePosterArtwork(promptData.artwork_prompt, genre);

    return NextResponse.json({
      artwork: artworkResult,
      typography: promptData.typography,
      color_palette: promptData.color_palette,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
