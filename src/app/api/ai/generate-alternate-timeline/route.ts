import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { aiModelProvider } from '@/lib/ai/model-provider';
import { sanitizePromptInput, checkRateLimit } from '@/lib/utils/security';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const rate = checkRateLimit(`whatif:${user.id}`, 20);
    if (!rate.allowed) return NextResponse.json({ error: 'Rate limit reached' }, { status: 429 });

    const { whatIfPrompt } = await req.json();
    if (!whatIfPrompt || typeof whatIfPrompt !== 'string') {
      return NextResponse.json({ error: 'whatIfPrompt required' }, { status: 400 });
    }

    const cleanPrompt = sanitizePromptInput(whatIfPrompt);
    const universe = await aiModelProvider.generateAlternateTimeline(cleanPrompt);

    return NextResponse.json({
      prompt: cleanPrompt,
      universe,
      isFictionalSpeculation: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
