'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Film, 
  ZoomIn, 
  X, 
  Compass, 
  ArrowLeft, 
  Download,
  Box
} from 'lucide-react';

interface ConceptImage {
  id: string;
  title: string;
  era: string;
  prompt: string;
  url: string;
  category: 'Cinematic Scene' | 'Keyframe' | 'Matte Painting' | 'Character Portrait';
}

const GALLERY_ITEMS: ConceptImage[] = [
  {
    id: 'art-1',
    title: 'Dawn upon the Sunken Temple Ghats',
    era: 'Ancient India',
    prompt: 'Ancient Mauryan river temple at sunrise, armored war elephants with silk banners, glowing brass tachyon artifact in the waters, cinematic lighting, 8k, photorealistic volumetric rays',
    url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    category: 'Cinematic Scene'
  },
  {
    id: 'art-2',
    title: 'Neo-Tokyo Cyber Spire Infiltration',
    era: 'Cyberpunk 2099',
    prompt: 'Futuristic rainy megacity alley with glowing holographic neon glyphs, cybernetic time traveller with glowing ocular implant, atmospheric fog, Unreal Engine 5 render',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    category: 'Matte Painting'
  },
  {
    id: 'art-3',
    title: 'Kepler Singularity Orbital Nexus',
    era: 'Space Civilization 3420',
    prompt: 'Relativistic starship docking at massive orbital ring station around a glowing sapphire nebula, cinematic sci-fi concept art, photorealistic stars',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    category: 'Keyframe'
  },
  {
    id: 'art-4',
    title: 'The Royal Sandstone Court & Astrolabe',
    era: 'Mughal Era',
    prompt: 'Imperial red sandstone court with marble arches, candlelit corridors, shadowy viziers and astronomers examining a celestial astrolabe, cinematic lighting',
    url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    category: 'Cinematic Scene'
  },
  {
    id: 'art-5',
    title: 'The Great Sphinx at the Solar Alignment',
    era: 'Ancient Egypt',
    prompt: 'Ancient Giza pyramid complex at solstice dusk, burning braziers, golden hieroglyphs floating along the pyramid capstone, cinematic lighting, high-detail texture',
    url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    category: 'Keyframe'
  },
  {
    id: 'art-6',
    title: 'Iron Citadel Ramparts under Siege',
    era: 'Medieval Kingdom',
    prompt: 'Stone fortress courtyard illuminated by blazing torches, catapult stones sailing across dark skies, armored knights standing vigilant at the gatehouse',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    category: 'Matte Painting'
  }
];

export default function GalleryPage() {
  const [selectedEra, setSelectedEra] = useState<string>('All');
  const [activeModalImage, setActiveModalImage] = useState<ConceptImage | null>(null);

  const filteredItems = selectedEra === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.era.toLowerCase().includes(selectedEra.toLowerCase()));

  const eras = ['All', 'Ancient India', 'Cyberpunk 2099', 'Space Civilization', 'Mughal Era', 'Ancient Egypt', 'Medieval Kingdom'];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-cyan-300" />
              Visual Concept Vault
            </Badge>
            <span className="text-[11px] font-mono text-purple-400">High-Resolution Keyframe Archive</span>
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-cyan-400" />
            AI Image & Scene Gallery
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Browse cinematic keyframes, matte paintings, and environment art rendered across all timeline eras.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/virtual-world"
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 text-xs font-bold text-cyan-300 shadow-glow-cyan hover:bg-cyan-900/60 transition"
          >
            <Box className="h-3.5 w-3.5 text-cyan-400" />
            <span>3D World</span>
          </Link>
          <Link
            href="/poster-studio"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-gray-200 hover:text-white transition"
          >
            <Film className="h-3.5 w-3.5 text-cyan-400" />
            <span>Movie Poster Studio</span>
          </Link>
        </div>
      </div>

      {/* Era Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {eras.map(era => (
          <button
            key={era}
            onClick={() => setSelectedEra(era)}
            className={`rounded-xl px-4 py-2 text-xs font-medium transition whitespace-nowrap ${
              selectedEra === era
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-glow-purple font-bold'
                : 'border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {era}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <GlassCard
            key={item.id}
            glow="cyan"
            className="group overflow-hidden p-0 flex flex-col justify-between transition-all hover:scale-[1.02]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-black">
              <img
                src={item.url}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="cyan">{item.era}</Badge>
                <Badge variant="purple">{item.category}</Badge>
              </div>

              <button
                onClick={() => setActiveModalImage(item)}
                className="absolute bottom-3 right-3 rounded-lg bg-black/60 p-2 text-white/80 hover:text-white hover:bg-black/80 transition backdrop-blur-md"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <h3 className="font-display text-base font-bold text-white group-hover:text-cyan-300 transition">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 font-mono italic line-clamp-2">
                "{item.prompt}"
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={`/poster-studio?title=${encodeURIComponent(item.title)}&genre=${encodeURIComponent(item.era)}`}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition"
                >
                  <Film className="h-3 w-3" />
                  <span>Turn into Movie Poster</span>
                </Link>

                <button
                  onClick={() => setActiveModalImage(item)}
                  className="text-xs text-gray-400 hover:text-white transition"
                >
                  Details
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Zoom / Inspection Modal */}
      {activeModalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative max-w-4xl w-full rounded-2xl border border-white/20 bg-[#060914] p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-gray-300 hover:text-white hover:bg-white/20 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black">
              <img
                src={activeModalImage.url}
                alt={activeModalImage.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="cyan">{activeModalImage.era}</Badge>
                <Badge variant="purple">{activeModalImage.category}</Badge>
              </div>
              <h3 className="font-display text-xl font-bold text-white">{activeModalImage.title}</h3>
              <div className="rounded-xl border border-white/10 bg-black/50 p-3">
                <span className="text-[10px] font-mono text-cyan-400 block uppercase tracking-wider mb-1">
                  AI Generation Prompt
                </span>
                <p className="text-xs text-gray-300 font-mono leading-relaxed">
                  {activeModalImage.prompt}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href={`/poster-studio?title=${encodeURIComponent(activeModalImage.title)}`}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow-purple hover:scale-105 transition"
              >
                <Film className="h-4 w-4" />
                <span>Create Theatrical Poster</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
