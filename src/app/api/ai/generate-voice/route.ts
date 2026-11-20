import { NextRequest, NextResponse } from 'next/server';
import { voiceProvider } from '@/lib/ai/voice-provider';

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId, character } = await req.json();
    if (!text) return NextResponse.json({ error: 'Text required' }, { status: 400 });

    let result;
    if (character) {
      result = await voiceProvider.generateCharacterDialogue(character, text, voiceId);
    } else {
      result = await voiceProvider.generateNarration(text, voiceId);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
