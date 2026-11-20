import { describe, it, expect } from 'vitest';
import { AppImageProvider } from '@/lib/ai/image-provider';
import { AppVoiceProvider } from '@/lib/ai/voice-provider';

describe('Image & Voice Fallback Architecture', () => {
  it('image provider returns honestly labeled curated preview artwork when unconfigured', async () => {
    const provider = new AppImageProvider();
    const result = await provider.generateSceneImage('Ancient temple at sunrise', 'ancient-india');

    expect(result.isPreview).toBe(true);
    expect(result.provider).toBe('curated_preview');
    expect(result.warning).toContain('Image generation provider is not configured');
    expect(result.imageUrl).toMatch(/^https:\/\//);
  });

  it('image provider labels character portraits honestly when unconfigured', async () => {
    const provider = new AppImageProvider();
    const portrait = await provider.generateCharacterPortrait('Futuristic cyborg detective');

    expect(portrait.isPreview).toBe(true);
    expect(portrait.imageUrl).toBeDefined();
    expect(portrait.provider).toBe('curated_preview');
  });

  it('voice provider defaults gracefully to browser SpeechSynthesis', async () => {
    const voiceProvider = new AppVoiceProvider();
    const narration = await voiceProvider.generateNarration('The temporal gate opens before you.');

    expect(narration.isExternal).toBe(false);
    expect(narration.type).toBe('browser_speech_synthesis');
    expect(narration.text).toBe('The temporal gate opens before you.');
  });
});
