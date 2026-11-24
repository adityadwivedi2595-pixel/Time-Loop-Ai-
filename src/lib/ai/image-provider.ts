/**
 * TIMELOOP AI – Image Provider Architecture
 * Supports external image generation APIs (e.g. NVIDIA NIM / Stability / Replicate)
 * with graceful, era-matched curated preview artwork when no external image key is set.
 */

export interface ImageGenerationResult {
  imageUrl: string;
  isPreview: boolean;
  provider: 'nvidia_nim_image' | 'external_api' | 'curated_preview';
  promptUsed: string;
  warning?: string;
}

export interface IImageProvider {
  generateCharacterPortrait(prompt: string, role?: string): Promise<ImageGenerationResult>;
  generateSceneImage(prompt: string, eraId?: string): Promise<ImageGenerationResult>;
  generateMoviePosterArtwork(prompt: string, genre?: string): Promise<ImageGenerationResult>;
  regenerateImage(prompt: string, context: string): Promise<ImageGenerationResult>;
}

// Curated high-fidelity cinematic visuals strictly mapped to specific historical & sci-fi eras
export const ERA_CINEMATIC_ASSETS: Record<string, { scene: string; portrait: string; poster: string }> = {
  'taj-mahal': {
    scene: '/images/taj-mahal-360.jpg',
    portrait: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
  },
  'delhi-fort': {
    scene: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80',
    portrait: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80',
  },
  'agra-fort': {
    scene: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    portrait: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  },
  'sun-temple': {
    scene: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
    portrait: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
  },
  'ancient-india': {
    scene: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    portrait: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
  },
  'cyberpunk-future': {
    scene: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    portrait: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
  },
  'space-civilization': {
    scene: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    portrait: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
  'medieval-kingdom': {
    scene: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    portrait: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  },
  'ancient-egypt': {
    scene: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    portrait: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
  },
  'roman-empire': {
    scene: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    portrait: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  },
  'feudal-japan': {
    scene: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    portrait: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  },
  'fantasy-universe': {
    scene: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    portrait: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  },
};

/**
 * Accurately resolve era asset by ID or text prompt keywords
 */
export function getEraCoverImage(identifier?: string): string {
  const text = (identifier || '').toLowerCase();
  if (text.includes('delhi') || text.includes('lal qila') || text.includes('red fort')) {
    return ERA_CINEMATIC_ASSETS['delhi-fort'].scene;
  }
  if (text.includes('agra fort')) {
    return ERA_CINEMATIC_ASSETS['agra-fort'].scene;
  }
  if (text.includes('sun temple') || text.includes('konark') || text.includes('surya')) {
    return ERA_CINEMATIC_ASSETS['sun-temple'].scene;
  }
  if (text.includes('taj') || text.includes('mahal') || text.includes('agra') || text.includes('mumtaz') || text.includes('shah jahan')) {
    return ERA_CINEMATIC_ASSETS['taj-mahal'].scene;
  }
  if (text.includes('cyber') || text.includes('tokyo') || text.includes('neo') || text.includes('spire') || text.includes('2099') || text.includes('netrunner')) {
    return ERA_CINEMATIC_ASSETS['cyberpunk-future'].scene;
  }
  if (text.includes('space') || text.includes('kepler') || text.includes('star') || text.includes('singularity') || text.includes('orbital') || text.includes('galaxy') || text.includes('2340')) {
    return ERA_CINEMATIC_ASSETS['space-civilization'].scene;
  }
  if (text.includes('medieval') || text.includes('knight') || text.includes('fortress') || text.includes('keep') || text.includes('siege') || text.includes('galahad') || text.includes('1190')) {
    return ERA_CINEMATIC_ASSETS['medieval-kingdom'].scene;
  }
  if (text.includes('egypt') || text.includes('pyramid') || text.includes('pharaoh') || text.includes('ankh') || text.includes('amun') || text.includes('1340')) {
    return ERA_CINEMATIC_ASSETS['ancient-egypt'].scene;
  }
  if (text.includes('rome') || text.includes('colosseum') || text.includes('roman') || text.includes('caesar') || text.includes('forum')) {
    return ERA_CINEMATIC_ASSETS['roman-empire'].scene;
  }
  if (text.includes('japan') || text.includes('kyoto') || text.includes('samurai') || text.includes('shogun') || text.includes('sakura')) {
    return ERA_CINEMATIC_ASSETS['feudal-japan'].scene;
  }
  if (text.includes('fantasy') || text.includes('eldoria') || text.includes('magic')) {
    return ERA_CINEMATIC_ASSETS['fantasy-universe'].scene;
  }
  return ERA_CINEMATIC_ASSETS['ancient-india'].scene;
}

export function getEraPortraitImage(identifier?: string): string {
  const text = (identifier || '').toLowerCase();
  if (text.includes('cyber') || text.includes('kael') || text.includes('netrunner')) {
    return ERA_CINEMATIC_ASSETS['cyberpunk-future'].portrait;
  }
  if (text.includes('space') || text.includes('lyra') || text.includes('pilot')) {
    return ERA_CINEMATIC_ASSETS['space-civilization'].portrait;
  }
  if (text.includes('knight') || text.includes('galahad') || text.includes('medieval')) {
    return ERA_CINEMATIC_ASSETS['medieval-kingdom'].portrait;
  }
  if (text.includes('priest') || text.includes('ankh') || text.includes('egypt')) {
    return ERA_CINEMATIC_ASSETS['ancient-egypt'].portrait;
  }
  if (text.includes('rome') || text.includes('roman') || text.includes('centurion') || text.includes('gladiator')) {
    return ERA_CINEMATIC_ASSETS['roman-empire'].portrait;
  }
  if (text.includes('japan') || text.includes('samurai') || text.includes('kenji') || text.includes('shogun')) {
    return ERA_CINEMATIC_ASSETS['feudal-japan'].portrait;
  }
  return ERA_CINEMATIC_ASSETS['ancient-india'].portrait;
}

export class AppImageProvider implements IImageProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.IMAGE_PROVIDER_API_KEY || '';
    this.baseUrl = process.env.IMAGE_PROVIDER_BASE_URL || '';
  }

  public isConfigured(): boolean {
    return !!(this.apiKey && this.apiKey.trim().length > 5);
  }

  async generateCharacterPortrait(prompt: string, role?: string): Promise<ImageGenerationResult> {
    if (!this.isConfigured()) {
      const match = getEraPortraitImage(`${prompt} ${role || ''}`);
      return {
        imageUrl: match,
        isPreview: true,
        provider: 'curated_preview',
        promptUsed: prompt,
        warning: 'Image generation provider is not configured. Showing era-accurate preview portrait.',
      };
    }

    return this.callExternalImageApi(prompt, 'portrait');
  }

  async generateSceneImage(prompt: string, eraId?: string): Promise<ImageGenerationResult> {
    if (!this.isConfigured()) {
      const match = getEraCoverImage(`${eraId || ''} ${prompt}`);
      return {
        imageUrl: match,
        isPreview: true,
        provider: 'curated_preview',
        promptUsed: prompt,
        warning: 'Image generation provider is not configured. Showing era-accurate preview artwork.',
      };
    }

    return this.callExternalImageApi(prompt, 'scene');
  }

  async generateMoviePosterArtwork(prompt: string, genre?: string): Promise<ImageGenerationResult> {
    if (!this.isConfigured()) {
      const match = getEraCoverImage(`${prompt} ${genre || ''}`);
      return {
        imageUrl: match,
        isPreview: true,
        provider: 'curated_preview',
        promptUsed: prompt,
        warning: 'Image generation provider is not configured. Showing era-accurate movie poster artwork.',
      };
    }

    return this.callExternalImageApi(prompt, 'poster');
  }

  async regenerateImage(prompt: string, context: string): Promise<ImageGenerationResult> {
    if (context === 'portrait') return this.generateCharacterPortrait(prompt);
    if (context === 'poster') return this.generateMoviePosterArtwork(prompt);
    return this.generateSceneImage(prompt);
  }

  private async callExternalImageApi(prompt: string, type: string): Promise<ImageGenerationResult> {
    try {
      const res = await fetch(this.baseUrl || 'https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: '1024x1024',
        }),
      });

      if (!res.ok) {
        throw new Error(`Image API returned status ${res.status}`);
      }

      const json = await res.json();
      const url = json.data?.[0]?.url;
      if (!url) throw new Error('No image URL returned from provider');

      return {
        imageUrl: url,
        isPreview: false,
        provider: 'external_api',
        promptUsed: prompt,
      };
    } catch (err: any) {
      console.warn('[ImageProvider Error fallback to era preview]:', err.message);
      return {
        imageUrl: getEraCoverImage(prompt),
        isPreview: true,
        provider: 'curated_preview',
        promptUsed: prompt,
      };
    }
  }
}

export const appImageProvider = new AppImageProvider();
export const imageProvider = appImageProvider;
