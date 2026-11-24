import { NextRequest, NextResponse } from 'next/server';
import { nvidiaClient } from '@/lib/ai/nvidia-client';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { checkRateLimit, sanitizePromptInput } from '@/lib/utils/security';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const rate = checkRateLimit(`char-chat:${user.id}`, 30);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 });
    }

    const body = await req.json();
    const characterName = sanitizePromptInput(body.characterName || 'Vanguard Commander');
    const characterRole = sanitizePromptInput(body.characterRole || 'Warrior');
    const eraName = sanitizePromptInput(body.eraName || 'Ancient India');
    const backstory = sanitizePromptInput(body.backstory || 'A stoic defender of the chronal nexus.');
    const userMessage = sanitizePromptInput(body.userMessage || 'Hello, who are you?');
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

    const systemPrompt = `You are roleplaying as "${characterName}", a ${characterRole} in the era of "${eraName}".
Backstory: ${backstory}

CRITICAL RULES:
- Output strictly 2 to 3 sentences of spoken in-character dialogue (under 60 words).
- Speak in a dramatic, immersive, cinematic tone fitting your historical or sci-fi era.
- Do not break character. Do not output meta-commentary.`;

    const formattedHistory = history
      .map((msg: { sender: string; text: string }) => `${msg.sender}: ${msg.text}`)
      .join('\n');

    const prompt = `${formattedHistory ? `Recent conversation:\n${formattedHistory}\n\n` : ''}User: "${userMessage}"\n\n${characterName} (spoken dialogue):`;

    const completion = await nvidiaClient.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 1024,
    });

    const messageObj = completion.choices?.[0]?.message as any;
    let cleanReply = '';

    if (messageObj?.content && typeof messageObj.content === 'string' && messageObj.content.trim().length > 0) {
      cleanReply = messageObj.content.trim();
    } else {
      let raw = (messageObj?.reasoning_content || '').trim();
      const paragraphs = raw.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
      const candidates = paragraphs.filter((p: string) => !p.startsWith('*') && !p.startsWith('-') && !p.startsWith('1.') && !p.startsWith('2.'));
      cleanReply = candidates[candidates.length - 1] || `I stand vigilant across the sands of ${eraName}.`;
    }

    cleanReply = cleanReply.replace(/^["']|["']$/g, '').trim();

    return NextResponse.json({
      reply: cleanReply || `Greetings, time traveller. I stand vigilant across the sands of ${eraName}. What brings you before me?`,
      characterName,
    });
  } catch (err: any) {
    console.error('Character chat error:', err);
    return NextResponse.json({
      reply: `By the stars, the tachyon interference is heavy! But heed my words: our era awaits your courage.`,
      characterName: 'Chronos Guide',
    });
  }
}
