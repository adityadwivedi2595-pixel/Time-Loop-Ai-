'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PosterStudioCanvas } from '@/components/poster/PosterStudioCanvas';
import { Badge } from '@/components/ui/Badge';
import { Film, RefreshCw } from 'lucide-react';

function PosterStudioContent() {
  const searchParams = useSearchParams();

  const title = searchParams.get('title') || 'The Chrono-Sutra of Pataliputra';
  const tagline = searchParams.get('tagline') || 'When history diverges, courage is the only constant.';
  const genre = searchParams.get('genre') || 'Sci-Fi Adventure';
  const eraName = searchParams.get('era') || 'Ancient India';
  const characterName = searchParams.get('character') || 'Arjun Thorne';
  const artworkUrl =
    searchParams.get('artwork') ||
    'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2">
          <Badge variant="cyan">Theatrical Art Direction</Badge>
          <Badge variant="purple">Poster Engine v1.0</Badge>
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
          <Film className="h-8 w-8 text-cyan-400" />
          AI Movie Poster Studio
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Render Hollywood-caliber theatrical posters for your interactive adventures. Customize typography, credits, and export crisp PNGs.
        </p>
      </div>

      <PosterStudioCanvas
        initialTitle={title}
        initialTagline={tagline}
        initialArtworkUrl={artworkUrl}
        genre={genre}
        eraName={eraName}
        characterName={characterName}
      />
    </div>
  );
}

export default function MoviePosterStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-xs font-mono text-gray-400">
          <RefreshCw className="h-5 w-5 animate-spin text-cyan-400 mr-2" />
          Loading Poster Studio...
        </div>
      }
    >
      <PosterStudioContent />
    </Suspense>
  );
}
