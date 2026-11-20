/**
 * TIMELOOP AI – Voice Provider Architecture
 * Primary: Client-side Web SpeechSynthesis (built into modern browsers)
 * Secondary: Optional external TTS provider adapter (ElevenLabs / PlayHT / Azure Speech).
 */

export interface VoiceGenerationResult {
  audioUrl?: string;
  type: 'browser_speech_synthesis' | 'external_tts';
  isExternal: boolean;
  text: string;
  voiceName?: string;
}

export interface IVoiceProvider {
  generateNarration(text: string, voiceId?: string): Promise<VoiceGenerationResult>;
  generateCharacterDialogue(character: string, text: string, voiceId?: string): Promise<VoiceGenerationResult>;
}

export class AppVoiceProvider implements IVoiceProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.VOICE_PROVIDER_API_KEY || '';
    this.baseUrl = process.env.VOICE_PROVIDER_BASE_URL || '';
  }

  public isExternalConfigured(): boolean {
    return !!(this.apiKey && this.apiKey.trim().length > 5);
  }

  async generateNarration(text: string, voiceId?: string): Promise<VoiceGenerationResult> {
    if (this.isExternalConfigured()) {
      return this.callExternalTTS(text, voiceId);
    }

    // Default: Browser SpeechSynthesis
    return {
      type: 'browser_speech_synthesis',
      isExternal: false,
      text,
      voiceName: 'Default System Narrator',
    };
  }

  async generateCharacterDialogue(character: string, text: string, voiceId?: string): Promise<VoiceGenerationResult> {
    const speechText = `${character} speaks: "${text}"`;
    return this.generateNarration(speechText, voiceId);
  }

  private async callExternalTTS(text: string, voiceId?: string): Promise<VoiceGenerationResult> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/text-to-speech/${voiceId || 'narrator-prime'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2',
        }),
      });

      if (!res.ok) throw new Error(`External TTS API status ${res.status}`);
      const audioBuffer = await res.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

      return {
        audioUrl,
        type: 'external_tts',
        isExternal: true,
        text,
        voiceName: voiceId || 'External AI Voice',
      };
    } catch (err: any) {
      console.warn('[VoiceProvider Error fallback to browser speech]:', err.message);
      return {
        type: 'browser_speech_synthesis',
        isExternal: false,
        text,
        voiceName: 'Browser Fallback Narrator',
      };
    }
  }
}

export const voiceProvider: IVoiceProvider = new AppVoiceProvider();
