import { describe, it, expect } from 'vitest';
import { NvidiaClient, NvidiaRateLimitError, NvidiaAuthError } from '@/lib/ai/nvidia-client';
import { CharacterProfileSchema } from '@/lib/ai/prompts';

describe('NVIDIA NIM Client & Parsing', () => {
  it('correctly reports configuration status', () => {
    const client = new NvidiaClient({ apiKey: 'nvapi-test-key-12345' });
    expect(client.isConfigured()).toBe(true);
    expect(client.getDefaultModel()).toBe('mistralai/mistral-large-4-1t-a52b');
  });

  it('generates mock completions deterministically in test mode', async () => {
    const client = new NvidiaClient({ apiKey: '' });
    const res = await client.chatCompletion({
      messages: [{ role: 'user', content: 'CHARACTER GENERATION PROMPT: test' }],
    });
    expect(res.choices[0].message.content).toBeDefined();

    const parsed = client.parseAndValidateJson(res.choices[0].message.content, (raw) =>
      CharacterProfileSchema.parse(raw)
    );
    expect(parsed.name).toBeDefined();
    expect(parsed.role).toBe('Time Traveller');
    expect(parsed.abilities.length).toBeGreaterThan(0);
  });

  it('correctly handles and cleans markdown code block wrapped JSON', () => {
    const client = new NvidiaClient();
    const markdownFenced = '```json\n{"name": "Aria", "role": "Warrior", "personality": ["Brave", "Just"], "appearance": "Silver armor and cape.", "backstory": "Guardian of the high towers.", "abilities": ["Blade mastery"], "strengths": ["Honor"], "weaknesses": ["Impatience"], "motivations": ["Protect the realm"], "visual_prompt": "Portrait of a warrior in silver armor."}\n```';

    const parsed = client.parseAndValidateJson(markdownFenced, (raw) =>
      CharacterProfileSchema.parse(raw)
    );
    expect(parsed.name).toBe('Aria');
    expect(parsed.role).toBe('Warrior');
  });

  it('throws descriptive error on malformed JSON output', () => {
    const client = new NvidiaClient();
    expect(() => {
      client.parseAndValidateJson('invalid non-json text', (raw) => raw);
    }).toThrow(/Failed to parse structured JSON/);
  });
});
