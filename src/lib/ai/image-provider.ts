/**
 * TIMELOOP AI – Image Provider Architecture
 * Supports external image generation APIs (e.g. NVIDIA NIM / Stability / Replicate)
 * with graceful, honestly-labeled curated preview artwork when no external image key is set.
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

// Curated high-fidelity cinematic visuals for preview fallbacks
const PREVIEW_ASSETS = {
  portraits: [
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  ],
  scenes: [
    'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  ],
  posters: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
  ],
};

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

  async generateCharacterPortrait(prompt: string, _role?: string): Promise<ImageGenerationResult> {
    if (!this.isConfigured()) {
      const randomIdx = Math.floor(Math.random() * PREVIEW_ASSETS.portraits.length);
      return {
        imageUrl: PREVIEW_ASSETS.portraits[randomIdx],
        isPreview: true,
        provider: 'curated_preview',
        promptUsed: prompt,
        warning: 'Image generation provider is not configured. Displaying honestly labeled curated preview artwork.',
      };
    }

    // Call external image API when configured
    return this.callExternalImageApi(prompt, 'portrait');
  }

  async generateSceneImage(prompt: string, _eraId?: string): Promise<ImageGenerationResult> {
    if (!this.isConfigured()) {
      const randomIdx = Math.floor(Math.random() * PREVIEW_ASSETS.scenes.length);
      return {
        imageUrl: PREVIEW_ASSETS.scenes[randomIdx],
        isPreview: true,
        provider: 'curated_preview',
        promptUsed: prompt,
        warning: 'Image generation provider is not configured. Displaying honestly labeled curated preview artwork.',
      };
    }

    return this.callExternalImageApi(prompt, 'scene');
  }

  async generateMoviePosterArtwork(prompt: string, _genre?: string): Promise<ImageGenerationResult> {
    if (!this.isConfigured()) {
      const randomIdx = Math.floor(Math.random() * PREVIEW_ASSETS.posters.length);
      return {
        imageUrl: PREVIEW_ASSETS.posters[randomIdx],
        isPreview: true,
        provider: 'curated_preview',
        promptUsed: prompt,
        warning: 'Image generation provider is not configured. Displaying honestly labeled curated preview artwork.',
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
          size: type === 'portrait' ? '1024x1024' : '1024x1024',
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
      console.warn('[ImageProvider Error fallback to preview]:', err.message);
      return {
        imageUrl: PREVIEW_ASSETS.scenes[0],
        isPreview: true,
        provider: 'curated_preview',
        promptUsed: prompt,
        warning: `External image generation failed (${err.message}). Reverted to preview artwork.`,
      };
    }
  }
}

export const imageProvider: IImageProvider = new AppImageProvider();
