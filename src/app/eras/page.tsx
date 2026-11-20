'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Filter, ShieldCheck, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { TimeEra } from '@/types/era';

export default function ErasPage() {
  const [eras, setEras] = useState<TimeEra[]>([]);
  const [filter, setFilter] = useState<'all' | 'historical' | 'fictional'>('all');

  useEffect(() => {
    async function loadEras() {
      try {
        const res = await fetch('/api/health');
        // Or directly load from storage / seed
        const erasData: TimeEra[] = [
          {
            id: 'ancient-india',
            name: 'Ancient India (Vedic & Mauryan Epoch)',
            description: 'Step into the golden age of emperors, grand spiritual debates, sage wisdom, and formidable fortresses along the sacred Sindhu and Ganga rivers.',
            classification: 'historical',
            cover_image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
            suggested_genres: ['Adventure', 'Mystery', 'Action', 'Thriller'],
            suggested_roles: ['Warrior', 'King', 'Queen', 'Explorer', 'Detective', 'Hero'],
            world_building: 'The bustling capital of Pataliputra rises behind triple-moated timber walls. Monasteries and universities like Takshashila foster deep secrets, while royal spymasters navigate intrigues between ambitious satraps and ascetic sages.',
            prompt_context: 'Historical setting during the Mauryan and Vedic antiquity. Real historical elements must be handled with respect, clearly demarcating cinematic dramatization from verified historical records.',
          },
          {
            id: 'mughal-era',
            name: 'Mughal Era (16th–17th Century)',
            description: 'A magnificent empire of sandstone palaces, Persian-infused court intrigues, jewel-encrusted thrones, and legendary battle strategies.',
            classification: 'historical',
            cover_image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
            suggested_genres: ['Mystery', 'Thriller', 'Adventure', 'Romance'],
            suggested_roles: ['King', 'Queen', 'Warrior', 'Detective', 'Villain', 'Explorer'],
            world_building: 'The court of the Padishah hums with court poets, master architects, and rival viziers scheming in candlelit marble corridors. Whispers of secret alliances, subterranean treasuries, and midnight rebellions echo through the red ramparts.',
            prompt_context: 'Historical empire in South Asia. Balance imperial splendor with complex diplomatic and tactical dilemmas.',
          },
          {
            id: 'ancient-egypt',
            name: 'Ancient Egypt (New Kingdom)',
            description: 'Golden sands along the Nile, colossal stone temples of Karnak and Luxor, hieroglyphic curses, and the sacred rule of living gods.',
            classification: 'historical',
            cover_image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
            suggested_genres: ['Mystery', 'Adventure', 'Fantasy', 'Thriller'],
            suggested_roles: ['Queen', 'King', 'Explorer', 'Warrior', 'Time Traveller'],
            world_building: 'The fertile black soil of Kemet is surrounded by merciless deserts. High Priests of Amun conduct esoteric rituals beneath star-aligned ceilings, while tomb guardians protect the sacred passages to the Duat.',
            prompt_context: 'Pharaonic New Kingdom era. Emphasize ancient architecture, the Nile as a lifeline, religious reverence, and dynastic politics.',
          },
          {
            id: 'medieval-kingdom',
            name: 'Medieval Kingdom (12th Century Europe)',
            description: 'Feudal castles, chivalric oaths, whispered conspiracies in stone bastions, crusader routes, and the constant threat of siege warfare.',
            classification: 'historical',
            cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
            suggested_genres: ['Adventure', 'Action', 'Mystery', 'Thriller'],
            suggested_roles: ['Warrior', 'King', 'Queen', 'Villain', 'Hero', 'Explorer'],
            world_building: 'Gargoyles overlook muddy cobblestone courtyards. Knights in chainmail uphold fragile feudal loyalties while rogue barons plot against the royal crown amidst harsh winters and peasant rebellions.',
            prompt_context: 'Western European high medieval period. Grounded in the harsh realities of feudal hierarchy, armor, siege weapons, and honor codes.',
          },
          {
            id: 'world-war-era',
            name: 'World War Era (1940s Espionage)',
            description: 'Shadowy blackouts across London, clandestine resistance cells in occupied Europe, Morse code transmissions, and nerve-wracking undercover operations.',
            classification: 'historical',
            cover_image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
            suggested_genres: ['Thriller', 'Mystery', 'Action', 'Horror'],
            suggested_roles: ['Detective', 'Warrior', 'Scientist', 'Hero', 'Time Traveller'],
            world_building: 'Smoke-filled train stations, radar stations perched on sea cliffs, and underground bunkers where top-secret decryption machines tick away against the countdown of global catastrophe.',
            prompt_context: '1940s wartime atmosphere. Focus on psychological tension, espionage, cryptanalysis, and moral grit.',
          },
          {
            id: 'cyberpunk-future',
            name: 'Neo-Kowloon 2099 (Cyberpunk Future)',
            description: 'Towering megastructures piercing perpetual acid rain, holographic neon advertisements, sentient cyber-gangs, and neuro-linked mega-corporations.',
            classification: 'fictional',
            cover_image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
            suggested_genres: ['Science Fiction', 'Action', 'Thriller', 'Mystery'],
            suggested_roles: ['Detective', 'Scientist', 'Villain', 'Hero', 'Time Traveller'],
            world_building: 'Synthetic adrenaline and illegal neural augmentations trade hands in the Lower Sump. Above the cloud layer, corporate oligarchs control artificial weather, orbital elevators, and quantum computing nodes.',
            prompt_context: 'Fictional dystopian high-tech future. Focus on neural interfaces, AI overlords, cybernetic modifications, and resistance factions.',
          },
          {
            id: 'space-civilization',
            name: 'Aethelgard Stellar Imperium (Year 3420)',
            description: 'Dyson swarms encompassing dying red giants, relativistic interstellar dreadnoughts, alien embassies on crystalline moons, and quantum stargates.',
            classification: 'fictional',
            cover_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
            suggested_genres: ['Science Fiction', 'Adventure', 'Thriller', 'Action'],
            suggested_roles: ['Explorer', 'Scientist', 'Warrior', 'King', 'Time Traveller'],
            world_building: 'Vast hollowed asteroids serve as orbital metropolises. Factions maneuver for control of antimatter synthesizers while ancient progenitor signals pulse from the galactic core.',
            prompt_context: 'Fictional hard/operatic science-fiction. Grand scale, orbital habitats, faster-than-light diplomacy, and cosmic wonder.',
          },
          {
            id: 'fantasy-universe',
            name: 'The Shattered Realms of Eldoria',
            description: 'Floating elemental continents, primordial arcane ley lines, elder dragons bound by ancient runes, and mythical kingdoms locked in planar war.',
            classification: 'fictional',
            cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
            suggested_genres: ['Fantasy', 'Adventure', 'Mystery', 'Horror'],
            suggested_roles: ['Hero', 'Villain', 'Queen', 'Warrior', 'Explorer', 'Time Traveller'],
            world_building: 'Crystal spires channel raw celestial magic across the rift islands. Mythical beasts roam twilight forests while ancient forgotten tombs hold relics capable of rewinding the world.',
            prompt_context: 'High fantasy setting with deep arcane lore, magical factions, ancient covenants, and legendary artifacts.',
          },
        ];
        setEras(erasData);
      } catch (err) {
        console.error(err);
      }
    }
    loadEras();
  }, []);

  const filteredEras = eras.filter((era) => {
    if (filter === 'historical') return era.classification === 'historical';
    if (filter === 'fictional') return era.classification === 'fictional';
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Badge variant="cyan">Temporal Destination Catalog</Badge>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
            Explore 8 Verified Time Eras
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Select a timeline to inspect its world-building lore, faction tensions, and launch your story.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
          {(['all', 'historical', 'fictional'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3 py-1.5 capitalize transition ${
                filter === tab ? 'bg-purple-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEras.map((era) => (
          <GlassCard key={era.id} interactive className="group flex flex-col justify-between overflow-hidden p-0" glow="purple">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={era.cover_image}
                alt={era.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060a17] via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge variant={era.classification === 'historical' ? 'emerald' : 'cyan'}>
                  {era.classification === 'historical' ? 'Historical Timeline' : 'Fictional Universe'}
                </Badge>
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-display text-base font-bold text-white group-hover:text-cyan-300 transition">
                  {era.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {era.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={`/eras/${era.id}`}
                  className="text-xs font-semibold text-purple-400 hover:text-cyan-300 flex items-center gap-1 transition"
                >
                  <span>Explore Lore</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href={`/story-config?eraId=${era.id}`}
                  className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 text-xs font-medium text-cyan-300 hover:bg-cyan-500/30 transition"
                >
                  Enter Era
                </Link>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
