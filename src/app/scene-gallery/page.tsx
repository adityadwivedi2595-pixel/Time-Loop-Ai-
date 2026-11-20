'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Image as ImageIcon, Sparkles, RefreshCw, ZoomIn } from 'lucide-react';

const SCENE_COLLECTION = [
  {
    title: 'Echoes by the Sacred River',
    era: 'Ancient India',
    prompt: 'Ancient Mauryan river temple at sunrise, armored war elephants with silk banners, glowing tachyon artifact in the waters, cinematic lighting, 8k',
    url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    type: 'Scene Concept',
  },
  {
    title: 'The Sandstone Ramparts',
    era: 'Mughal Era',
    prompt: 'Imperial red sandstone court with marble arches, candlelit corridors, shadowy viziers and astronomers examining a celestial astrolabe, cinematic lighting',
    url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    type: 'Environment Keyframe',
  },
  {
    title: 'Neo-Kowloon Neon Downpour',
    era: 'Cyberpunk 2099',
    prompt: 'Futuristic rainy megacity alley with glowing holographic glyphs, cybernetic time traveller with glowing ocular implant, atmospheric fog',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    type: 'Atmospheric Matte',
  },
  {
    title: 'Aethelgard Orbital Spires',
    era: 'Space Civilization 3420',
    prompt: 'Relativistic starship docking at massive orbital ring station around a glowing sapphire nebula, cinematic sci-fi concept art, photorealistic',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    type: 'Cosmic Landscape',
  },
];

export default function SceneGalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <Badge variant="cyan">Visual Concept Vault</Badge>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
          <ImageIcon className="h-8 w-8 text-cyan-400" />
          AI Scene Visualizer & Gallery
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Browse generated concept art and cinematic keyframes captured from player story chapters across all 8 eras.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SCENE_COLLECTION.map((scene, idx) => (
          <GlassCard key={idx} className="group overflow-hidden p-0" glow="cyan">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={scene.url}
                alt={scene.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-cinema-gradient" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="cyan">{scene.era}</Badge>
                <Badge variant="purple">{scene.type}</Badge>
              </div>
            </div>

            <div className="p-6 space-y-2">
              <h3 className="font-display text-lg font-bold text-white">{scene.title}</h3>
              <p className="text-xs text-gray-300 font-mono italic">"{scene.prompt}"</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
