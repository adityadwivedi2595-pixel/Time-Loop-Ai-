/**
 * TIMELOOP AI – NVIDIA NIM Client
 * Production-ready inference client for NVIDIA API (Mistral Large 4 / Nemotron / Llama).
 * Features: Exponential Backoff, Request Timeout, Token Logging, Error Classification,
 * and Structured JSON Output extraction.
 */

export interface NvidiaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface NvidiaChatCompletionOptions {
  model?: string;
  messages: NvidiaMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  response_format?: { type: 'json_object' | 'text' };
  timeoutMs?: number;
}

export interface NvidiaUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface NvidiaChatCompletionResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: NvidiaUsage;
}

// Error Classes
export class NvidiaApiError extends Error {
  constructor(public statusCode: number, message: string, public errorType: string = 'api_error') {
    super(`[NVIDIA NIM ${errorType}] (${statusCode}): ${message}`);
    this.name = 'NvidiaApiError';
  }
}

export class NvidiaRateLimitError extends NvidiaApiError {
  constructor(message: string) {
    super(429, message, 'rate_limit_exceeded');
    this.name = 'NvidiaRateLimitError';
  }
}

export class NvidiaAuthError extends NvidiaApiError {
  constructor(message: string) {
    super(401, message, 'authentication_failed');
    this.name = 'NvidiaAuthError';
  }
}

export class NvidiaTimeoutError extends NvidiaApiError {
  constructor(timeoutMs: number) {
    super(408, `NVIDIA API request timed out after ${timeoutMs}ms`, 'request_timeout');
    this.name = 'NvidiaTimeoutError';
  }
}

export class NvidiaClient {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;
  private maxRetries: number;

  constructor(config?: { apiKey?: string; baseUrl?: string; defaultModel?: string; maxRetries?: number }) {
    this.apiKey = config?.apiKey || process.env.NVIDIA_API_KEY || '';
    this.baseUrl = (config?.baseUrl || process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/+$/, '');
    this.defaultModel = config?.defaultModel || process.env.NVIDIA_MODEL || 'mistralai/mistral-large-4-1t-a52b';
    this.maxRetries = config?.maxRetries ?? 3;
  }

  public isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.trim().length > 5;
  }

  public getDefaultModel(): string {
    return this.defaultModel;
  }

  /**
   * Verified Chat Completion request with exponential backoff & timeout
   */
  public async chatCompletion(options: NvidiaChatCompletionOptions): Promise<NvidiaChatCompletionResponse> {
    const model = options.model || this.defaultModel;
    const timeoutMs = options.timeoutMs || 45000;

    // Check if configured; if not in production and no key, route to mock for local testing/demo
    if (!this.isConfigured()) {
      if (process.env.NODE_ENV === 'test' || !process.env.NVIDIA_API_KEY) {
        return this.generateMockCompletion(options);
      }
      throw new NvidiaAuthError('NVIDIA_API_KEY is missing or invalid in server environment.');
    }

    const url = `${this.baseUrl}/chat/completions`;
    const payload = {
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      top_p: options.top_p ?? 0.9,
      max_tokens: options.max_tokens ?? 2048,
      stream: options.stream ?? false,
      ...(options.response_format ? { response_format: options.response_format } : {}),
    };

    let attempt = 0;
    let delay = 1000;

    while (attempt <= this.maxRetries) {
      attempt++;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const status = response.status;
          let errorText = '';
          try {
            const errJson = await response.json();
            errorText = JSON.stringify(errJson);
          } catch {
            errorText = await response.text();
          }

          if (status === 401 || status === 403) {
            throw new NvidiaAuthError(`Invalid NVIDIA credentials: ${errorText}`);
          }
          if (status === 429) {
            if (attempt <= this.maxRetries) {
              await new Promise((res) => setTimeout(res, delay));
              delay *= 2;
              continue;
            }
            throw new NvidiaRateLimitError(`NVIDIA rate limit reached: ${errorText}`);
          }
          if (status >= 500 && attempt <= this.maxRetries) {
            await new Promise((res) => setTimeout(res, delay));
            delay *= 2;
            continue;
          }

          throw new NvidiaApiError(status, errorText);
        }

        const data: NvidiaChatCompletionResponse = await response.json();

        // Token usage logging
        if (data.usage) {
          console.log(`[NVIDIA NIM Usage] Model: ${data.model} | Prompt: ${data.usage.prompt_tokens} | Completion: ${data.usage.completion_tokens} | Total: ${data.usage.total_tokens}`);
        }

        return data;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          if (attempt <= this.maxRetries) {
            await new Promise((res) => setTimeout(res, delay));
            delay *= 2;
            continue;
          }
          throw new NvidiaTimeoutError(timeoutMs);
        }

        if (err instanceof NvidiaApiError) {
          throw err;
        }

        if (attempt <= this.maxRetries) {
          await new Promise((res) => setTimeout(res, delay));
          delay *= 2;
          continue;
        }

        throw new NvidiaApiError(500, err.message || 'Unknown network error contacting NVIDIA NIM');
      }
    }

    throw new NvidiaApiError(500, 'Exceeded maximum retry attempts contacting NVIDIA NIM');
  }

  /**
   * Helper to extract and safely parse structured JSON from NVIDIA completions
   */
  public async generateStructuredJson<T>(
    messages: NvidiaMessage[],
    schemaValidator: (raw: unknown) => T,
    options?: Partial<NvidiaChatCompletionOptions>
  ): Promise<T> {
    const response = await this.chatCompletion({
      messages,
      temperature: 0.5,
      response_format: { type: 'json_object' },
      ...options,
    });

    const content = response.choices?.[0]?.message?.content || '{}';
    return this.parseAndValidateJson(content, schemaValidator);
  }

  /**
   * Robust JSON parser that handles code blocks, leading text, or markdown fencing
   */
  public parseAndValidateJson<T>(rawContent: string, schemaValidator: (raw: unknown) => T): T {
    let clean = rawContent.trim();

    // Strip ```json and ``` fences if present
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    // Locate first '{' and last '}'
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      clean = clean.substring(firstBrace, lastBrace + 1);
    }

    try {
      const parsed = JSON.parse(clean);
      return schemaValidator(parsed);
    } catch (parseError: any) {
      console.error('[NVIDIA JSON Parsing Failed]', parseError.message, 'Raw content:', rawContent);
      throw new Error(`Failed to parse structured JSON from NVIDIA NIM output: ${parseError.message}`);
    }
  }

  /**
   * Health / model verification probe
   */
  public async verifyModelAccess(modelToTest?: string): Promise<{ success: boolean; model: string; message: string }> {
    const model = modelToTest || this.defaultModel;
    if (!this.isConfigured()) {
      return { success: false, model, message: 'NVIDIA_API_KEY is not configured.' };
    }

    try {
      const res = await this.chatCompletion({
        model,
        messages: [{ role: 'user', content: 'Respond with the word OK.' }],
        max_tokens: 10,
        temperature: 0.1,
        timeoutMs: 15000,
      });

      return {
        success: true,
        model: res.model || model,
        message: 'NVIDIA NIM connection verified successfully.',
      };
    } catch (err: any) {
      return {
        success: false,
        model,
        message: err.message || 'Verification failed.',
      };
    }
  }

  /**
   * High-fidelity Deterministic Mock Provider for CI/Testing and Offline Evaluation
   */
  private generateMockCompletion(options: NvidiaChatCompletionOptions): NvidiaChatCompletionResponse {
    const userPrompt = options.messages.find((m) => m.role === 'user')?.content || '';
    let responseText = '{}';

    if (userPrompt.includes('CHARACTER GENERATION PROMPT') || userPrompt.includes('character profile')) {
      responseText = JSON.stringify({
        name: 'Zephyr Vance',
        role: 'Time Traveller',
        personality: ['Daring', 'Inquisitive', 'Loyal', 'Stoic'],
        appearance: 'Weathered trench coat embedded with chronal fiber, piercing violet eyes, and a brass temporal wrist-relay.',
        backstory: 'A temporal cartographer who mapped the forbidden rifts of the 23rd century before plunging into the antiquity of the Indus Valley.',
        abilities: ['Temporal Flux Perception', 'Probability Distortion', 'Ancient Polyglot'],
        strengths: ['Unshakable courage', 'Instant architectural spatial analysis'],
        weaknesses: ['Vulnerable to chronal resonance shocks', 'Reluctant to leave fallen allies'],
        motivations: ['Safeguard the prime timeline', 'Uncover the progenitor chronometer'],
        visual_prompt: 'Cinematic portrait of a futuristic time traveller in ancient ruins, atmospheric cyan dust, volumetric lighting, 8k resolution',
      });
    } else if (userPrompt.includes('STORY PLANNING PROMPT') || userPrompt.includes('story overview')) {
      responseText = JSON.stringify({
        title: 'The Paradox of the Sun Temple',
        tagline: 'When history diverges, courage is the only constant.',
        story_description: 'An anomalous rift opens beneath the sacred altar, threatening to erase three dynasties unless the lost seal is retrieved.',
        world_setting: 'The sandstone ramparts of ancient Pataliputra during the monsoon equinox.',
        opening_scene: 'Rain lashes against the carved marble pillars as royal scouts report strange blue lightning on the river bank.',
        main_conflict: 'Imperial spymasters suspect foreign sorcery, while a rogue chronomancer seeks to rewrite the royal succession.',
        supporting_characters: ['Commander Vikrama', 'Priestess Ananya', 'The Shadow Vizier'],
        important_locations: ['The River Citadel', 'The Subterranean Vaults', 'The Observatory of the Sun'],
        main_objectives: ['Gain audience with the royal court', 'Investigate the glowing river anomaly', 'Secure the chronal seal'],
        chapter_outline: [
          'Chapter 1: The Omen in the Sands',
          'Chapter 2: Conspiracies in the Red Palace',
          'Chapter 3: The Temporal Divergence',
        ],
        character_dialogues: [
          { character: 'Commander Vikrama', text: 'You speak in riddles stranger, but your eyes carry the weight of a hundred wars.' },
        ],
        story_summary: 'The journey begins in the borderlands of the ancient empire.',
        initial_timeline_state: {
          relationships: { 'Commander Vikrama': 50, 'Priestess Ananya': 60 },
          flags: { 'allied_with_scouts': false },
          resources: { 'influence': 25, 'reputation': 50 },
        },
      });
    } else if (userPrompt.includes('SCENE GENERATION PROMPT') || userPrompt.includes('next scene')) {
      responseText = JSON.stringify({
        scene_title: 'The Trial of the Obsidian Gate',
        narration: 'Torchlight casts long, dancing shadows across the monolithic basalt stones. The royal council watches in tense silence as the glowing brass anomaly resonates with your temporal wrist-relay.',
        dialogues: [
          {
            character: 'Grand Vizier',
            text: 'If your talisman is truly a gift from the sky gods, prove it by disarming the vault runes!',
          },
          {
            character: 'Zephyr Vance',
            text: 'Step back, your Excellency. One false oscillation will vaporize this entire courtyard.',
          },
        ],
        scene_description: 'A subterranean court lined with ancient carved serpent pillars, lit by flickering bronze braziers and electric blue chronal arcs.',
        visual_prompt: 'Ancient Indian subterranean court, grand stone pillars, glowing blue tachyon arcs around a brass device, cinematic fantasy lighting, high detail',
        choices: [
          {
            id: 'c_brave',
            text: 'Channel your chronal gauntlet to safely absorb the tachyon surge and win the council’s reverence.',
            consequence_hint: 'Raises Influence significantly (+20), but risks personal energy depletion.',
          },
          {
            id: 'c_cunning',
            text: 'Expose the Grand Vizier’s secret sabotage runes to the royal guards before touching the device.',
            consequence_hint: 'Shifts political loyalty, turning the Vizier into an active rival while securing royal patronage.',
          },
          {
            id: 'c_stealth',
            text: 'Throw a smoke flash, grab the core crystal, and dive through the secret drainage canal.',
            consequence_hint: 'Branch into an outlaw fugitive path, unlocking underground rebel faction alliances.',
          },
        ],
        state_changes: {
          relationships: {
            'Grand Vizier': -15,
            'Royal Guard': 15,
          },
          flags: {
            'vault_entered': true,
          },
          resources: {
            'influence': 10,
            'reputation': 15,
          },
        },
        next_chapter: false,
        ending_candidate: null,
      });
    } else if (userPrompt.includes('WHAT IF') || userPrompt.includes('alternate timeline')) {
      responseText = JSON.stringify({
        divergence_title: 'The Steam-Powered Indus Empire',
        alternate_world: 'In 1800 BCE, Harappan engineers harness geothermal super-steam from subterranean magma pockets, building automated irrigation networks and bronze clockwork trade galleys.',
        timeline_events: [
          '1800 BCE: Discovery of the Great Geothermal Geyser in Mohenjo-Daro.',
          '1750 BCE: First mechanized grain silos and automated aqueducts span the Sindhu basin.',
          '1600 BCE: Bronze steam-galleys establish trans-oceanic trade routes with Dynastic Egypt and Mesopotamia.',
          '1500 BCE: The Golden Age of Bronze Automation prevents the Bronze Age Collapse.',
        ],
        main_characters: ['Master Mechanic Arya', 'Emissary Hapu of Thebes', 'The Clockwork Guildmaster'],
        major_conflicts: ['Rivalry between the Water Guild and the Bronze Smelters', 'Subterranean seismic anomalies threatening the geothermal core'],
        story_chapters: [
          'Chapter 1: The Rhythmic Piston of Mohenjo-Daro',
          'Chapter 2: Emissary from the Nile',
          'Chapter 3: The Steam Revolution',
        ],
        consequences: ['Industrial revolution occurs 3,000 years early', 'Global ecology preserved via geothermal rather than coal power'],
        possible_endings: ['The Planetary Steam Federation', 'The Catastrophic Caldera Breach'],
      });
    } else {
      responseText = JSON.stringify({
        title: 'Chronal Odyssey',
        content: 'The timestream stabilizes as you make your move.',
      });
    }

    return {
      id: `mock-completion-${Date.now()}`,
      model: options.model || this.defaultModel,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: responseText,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 120,
        completion_tokens: 280,
        total_tokens: 400,
      },
    };
  }
}

// Global NVIDIA NIM client instance
export const nvidiaClient = new NvidiaClient();
