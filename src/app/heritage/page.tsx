'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  INDIAN_MONUMENTS_DATABASE, 
  ALL_INDIAN_STATES, 
  getMonumentThenAndNow,
  getMonumentAudioChapters
} from '@/data/indian-monuments';
import { PhotoGalleryLightbox } from '@/components/heritage/PhotoGalleryLightbox';
import { CinematicStructureTour } from '@/components/heritage/CinematicStructureTour';
import { PresentationSlidesShowcase } from '@/components/heritage/PresentationSlidesShowcase';
import { ArchitecturalSpecsBlueprint } from '@/components/heritage/ArchitecturalSpecsBlueprint';
import { SubterraneanSecretsSection } from '@/components/heritage/SubterraneanSecretsSection';
import { HistoricalComparisonSlider } from '@/components/heritage/HistoricalComparisonSlider';
import { AudioHistoryPlayer } from '@/components/heritage/AudioHistoryPlayer';
import { MonumentAIHistoryChat } from '@/components/heritage/MonumentAIHistoryChat';
import { MonumentHistoryTabs } from '@/components/heritage/MonumentHistoryTabs';
import { stopUniversalAudio } from '@/lib/heritage-voice';
import { 
  Search, 
  MapPin, 
  Compass, 
  Heart, 
  Share2, 
  ArrowLeft,
  Check,
  Globe
} from 'lucide-react';

export default function HeritageHistoryPage() {
  const [selectedMonumentId, setSelectedMonumentId] = useState<string>('taj-mahal');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [audioLanguage, setAudioLanguage] = useState<'hi' | 'en'>('hi');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [recentlyExplored, setRecentlyExplored] = useState<string[]>(['taj-mahal']);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Load favorites and recents from localStorage and check URL query param
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlMonument = params.get('monument');
        if (urlMonument && INDIAN_MONUMENTS_DATABASE.some((m) => m.id === urlMonument)) {
          setSelectedMonumentId(urlMonument);
        }
      }
      const savedFavs = localStorage.getItem('timeloop_heritage_favs');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      const savedRecent = localStorage.getItem('timeloop_heritage_recents');
      if (savedRecent) setRecentlyExplored(JSON.parse(savedRecent));
    } catch {
      // ignore
    }
  }, []);

  const monument = useMemo(() => {
    return INDIAN_MONUMENTS_DATABASE.find((m) => m.id === selectedMonumentId) || INDIAN_MONUMENTS_DATABASE[0];
  }, [selectedMonumentId]);

  const thenAndNow = useMemo(() => {
    return getMonumentThenAndNow(monument);
  }, [monument]);

  const audioChapters = useMemo(() => {
    return getMonumentAudioChapters(monument);
  }, [monument]);

  // Filtering monuments
  const filteredMonuments = useMemo(() => {
    return INDIAN_MONUMENTS_DATABASE.filter((m) => {
      const matchesState = selectedState === 'All States' || 
        m.state.toLowerCase() === selectedState.toLowerCase() ||
        (selectedState === 'Jammu & Kashmir' && (m.state.includes('Jammu') || m.state.includes('Ladakh') || m.state.includes('Kashmir'))) ||
        (selectedState === 'Ladakh' && (m.state.includes('Ladakh') || m.state.includes('Jammu')));
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.hindiName.includes(searchQuery) ||
        m.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.dynastyOrBuilder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.architecturalStyle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorites = !showOnlyFavorites || favorites.includes(m.id);
      return matchesState && matchesSearch && matchesFavorites;
    });
  }, [selectedState, searchQuery, showOnlyFavorites, favorites]);

  // Handle selecting a new monument
  const handleSelectMonument = (mId: string) => {
    stopUniversalAudio();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSelectedMonumentId(mId);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('monument', mId);
      window.history.replaceState({}, '', url.toString());
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setRecentlyExplored((prev) => {
      const filtered = prev.filter((id) => id !== mId);
      const updated = [mId, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('timeloop_heritage_recents', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Toggle favorite
  const toggleFavorite = (mId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(mId) ? prev.filter((id) => id !== mId) : [...prev, mId];
      try {
        localStorage.setItem('timeloop_heritage_favs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/heritage?monument=${monument.id}`;
      navigator.clipboard?.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Same state monuments (strictly from the same state)
  const sameStateMonuments = useMemo(() => {
    return INDIAN_MONUMENTS_DATABASE.filter(
      (m) => m.id !== monument.id && m.state === monument.state
    ).slice(0, 4);
  }, [monument]);

  // Related monuments from the same builder or architectural era in other states
  const relatedDynastyMonuments = useMemo(() => {
    const builderKey = monument.dynastyOrBuilder.split(' ')[0];
    return INDIAN_MONUMENTS_DATABASE.filter(
      (m) => m.id !== monument.id && m.state !== monument.state && m.dynastyOrBuilder.toLowerCase().includes(builderKey.toLowerCase())
    ).slice(0, 4);
  }, [monument]);

  return (
    <div className="min-h-screen bg-[#02040b] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* ========================================================
          TOP GLOBAL HEADER: BRAND & UNIVERSAL NAVIGATION
      ======================================================== */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030612]/95 backdrop-blur-xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Back button */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-mono transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>TIMELOOP AI</span>
            </Link>

            <div className="h-5 w-[1px] bg-white/15 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="font-display text-sm sm:text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-purple-400">
                INDIA HERITAGE HISTORY & VOICE EXPLORER
              </h1>
            </div>
          </div>

          {/* Search Bar & State Filter */}
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search 47 Indian monuments, cities, dynasties, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="rounded-xl border border-white/15 bg-black px-3 py-1.5 text-xs text-cyan-300 font-mono font-bold cursor-pointer focus:border-cyan-400 focus:outline-none"
            >
              {ALL_INDIAN_STATES.map((st) => (
                <option key={st} value={st} className="bg-black text-white">{st}</option>
              ))}
            </select>

            {/* Favorite Filter Toggle */}
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                showOnlyFavorites
                  ? 'border-rose-400 bg-rose-500/20 text-rose-300 shadow-glow-purple'
                  : 'border-white/15 bg-white/5 text-gray-400 hover:text-white'
              }`}
              title={showOnlyFavorites ? 'Show All Monuments' : 'Show Only Favorites'}
            >
              <Heart className={`h-4 w-4 ${showOnlyFavorites ? 'fill-rose-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          TWO-COLUMN WORKSPACE: SIDEBAR HUB + RICH CONTENT
      ======================================================== */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* ========================================================
            LEFT COLUMN: MONUMENT DIRECTORY (4 Cols)
        ======================================================== */}
        <aside className="lg:col-span-4 border-r border-white/10 bg-[#030612]/90 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-65px)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-400" />
              <h2 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                Heritage Sites ({filteredMonuments.length})
              </h2>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">{selectedState}</span>
          </div>

          {/* Monument Cards List */}
          <div className="space-y-2">
            {filteredMonuments.map((m) => {
              const isSelected = m.id === selectedMonumentId;
              const isFav = favorites.includes(m.id);

              return (
                <div
                  key={m.id}
                  onClick={() => handleSelectMonument(m.id)}
                  className={`group relative rounded-2xl border p-2.5 transition flex gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/70 shadow-glow-cyan scale-[1.01] ring-1 ring-cyan-400/50'
                      : 'border-white/10 bg-black/60 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  {/* Thumbnail Cover Photo */}
                  <div className="h-16 w-20 rounded-xl overflow-hidden flex-shrink-0 bg-black relative border border-white/10">
                    <img
                      src={m.photos[0]?.url || ('/images/monuments/' + m.id + '.jpg')}
                      alt={m.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>

                  {/* Monument Info */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-display text-xs font-bold text-white truncate group-hover:text-cyan-300">
                        {m.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(m.id);
                        }}
                        className="text-gray-400 hover:text-rose-400 transition cursor-pointer"
                        title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
                      </button>
                    </div>

                    <p className="text-[10px] text-amber-300 font-hindi truncate">{m.hindiName}</p>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                      <span className="text-cyan-300 truncate">{m.city}, {m.state}</span>
                    </div>

                    <div className="pt-0.5 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-white/5 text-[9px] font-mono text-gray-400 truncate">
                        {m.historicalPeriod.split('(')[0].trim()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recently Explored Strip */}
          {recentlyExplored.length > 1 && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Recently Explored:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recentlyExplored.map((rId) => {
                  const rm = INDIAN_MONUMENTS_DATABASE.find((m) => m.id === rId);
                  if (!rm) return null;
                  return (
                    <button
                      key={rId}
                      onClick={() => handleSelectMonument(rId)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 hover:border-cyan-400 text-gray-300 hover:text-white transition cursor-pointer"
                    >
                      {rm.name.split('(')[0].trim()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* ========================================================
            RIGHT COLUMN: COMPLETE MONUMENT DETAILS & VOICE (8 Cols)
        ======================================================== */}
        <main className="lg:col-span-8 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-65px)]">
          {/* ========================================================
              PHASE 8: MONUMENT HEADER & ACTIONS
          ======================================================== */}
          <div className="p-4 sm:p-5 rounded-3xl border border-white/10 bg-gradient-to-r from-black via-[#060c1d] to-black backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg sm:text-2xl font-black text-white">
                  {monument.name}
                </h2>
                <span className="text-sm sm:text-base text-amber-300 font-hindi font-bold">
                  ({monument.hindiName})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400 pt-0.5">
                <span className="flex items-center gap-1 text-cyan-300">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{monument.city}, {monument.state}</span>
                </span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{monument.historicalPeriod}</span>
                <span>•</span>
                <span className="text-gray-400">{monument.coordinates}</span>
              </div>
            </div>

            {/* Favorite & Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(monument.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  favorites.includes(monument.id)
                    ? 'bg-rose-500 text-white shadow-glow-purple'
                    : 'bg-white/5 border border-white/15 text-gray-300 hover:text-white'
                }`}
              >
                <Heart className={`h-4 w-4 ${favorites.includes(monument.id) ? 'fill-white' : ''}`} />
                <span>{favorites.includes(monument.id) ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-gray-300 hover:text-white text-xs font-mono font-bold transition cursor-pointer"
              >
                {copiedShare ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                <span>{copiedShare ? 'Copied Link' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              CINEMATIC STRUCTURE & TIME-TRAVEL AUDIO TOUR SCREEN
          ======================================================== */}
          <section className="space-y-3">
            <CinematicStructureTour
              monument={monument}
              language={audioLanguage}
              onLanguageChange={setAudioLanguage}
            />
          </section>

          {/* ========================================================
              HIGH-DETAIL MASTER PRESENTATION SLIDES (SLIDES 05–12)
          ======================================================== */}
          <section className="space-y-3">
            <PresentationSlidesShowcase
              currentMonumentId={monument.id}
              language={audioLanguage}
              onSelectMonument={(id) => handleSelectMonument(id)}
            />
          </section>

          {/* ========================================================
              SLIDES 9-12 FEATURE: ARCHITECTURAL DOSSIER & BLUEPRINT SPECS
          ======================================================== */}
          <section className="space-y-3">
            <ArchitecturalSpecsBlueprint
              monument={monument}
              language={audioLanguage}
            />
          </section>

          {/* ========================================================
              SLIDE 5 FEATURE: SUBTERRANEAN SECRETS & ANCIENT FOUNDATIONS
          ======================================================== */}
          <section className="space-y-3">
            <SubterraneanSecretsSection
              monument={monument}
              language={audioLanguage}
            />
          </section>

          {/* ========================================================
              PHASE 2: AUTHENTIC PHOTOGRAPHS & LIGHTBOX
          ======================================================== */}
          <section className="space-y-3">
            <PhotoGalleryLightbox
              photos={monument.photos}
              monumentName={monument.name}
            />
          </section>

          {/* ========================================================
              SLIDE 6 FEATURE: TIME-TRAVEL ARCHIVAL COMPARISON (THEN AND NOW)
          ======================================================== */}
          {thenAndNow && (
            <section className="space-y-3">
              <HistoricalComparisonSlider
                comparison={thenAndNow}
                monumentName={monument.name}
                language={audioLanguage}
              />
            </section>
          )}

          {/* ========================================================
              PHASE 5 & 6: AI VOICE HISTORY GUIDE & AUDIO CONTROLS
          ======================================================== */}
          <section className="space-y-3">
            <AudioHistoryPlayer
              chapters={audioChapters}
              monumentName={monument.name}
              hindiName={monument.hindiName}
              language={audioLanguage}
              onLanguageChange={setAudioLanguage}
            />
          </section>

          {/* ========================================================
              PHASE 3: COMPLETE DOCUMENTED HISTORY (TABS)
          ======================================================== */}
          <section className="space-y-3">
            <MonumentHistoryTabs
              monument={monument}
            />
          </section>

          {/* ========================================================
              PHASE 7: INTERACTIVE CONVERSATIONAL AI HISTORY GUIDE
          ======================================================== */}
          <section className="space-y-3">
            <MonumentAIHistoryChat
              monument={monument}
              language={audioLanguage}
            />
          </section>

          {/* ========================================================
              RELATED HERITAGE MONUMENTS STRIP (GEOGRAPHICALLY & HISTORICALLY SEPARATED)
          ======================================================== */}
          {sameStateMonuments.length > 0 && (
            <section className="p-4 rounded-3xl border border-white/10 bg-black/60 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span>More Historic Sites in {monument.state}</span>
                </h4>
                <span className="text-[10px] font-mono text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800">
                  {monument.state}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sameStateMonuments.map((rm) => (
                  <button
                    key={rm.id}
                    onClick={() => handleSelectMonument(rm.id)}
                    className="p-2.5 rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-400 hover:bg-white/10 transition text-left cursor-pointer space-y-1.5 group"
                  >
                    <div className="h-20 w-full rounded-xl overflow-hidden bg-black border border-white/5 relative">
                      <img
                        src={rm.photos[0]?.url || ('/images/monuments/' + rm.id + '.jpg')}
                        alt={rm.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <h5 className="font-display text-xs font-bold text-white truncate group-hover:text-cyan-300">{rm.name}</h5>
                    <p className="text-[10px] text-cyan-300 font-mono truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0 text-cyan-400" />
                      <span>{rm.city}, {rm.state}</span>
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {relatedDynastyMonuments.length > 0 && (
            <section className="p-4 rounded-3xl border border-white/10 bg-black/60 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="h-4 w-4 text-amber-400" />
                  <span>Historic Sites from the Same Era / Dynasty</span>
                </h4>
                <span className="text-[10px] font-mono text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800 truncate max-w-[220px]">
                  {monument.dynastyOrBuilder.split('(')[0].trim().slice(0, 32)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedDynastyMonuments.map((rm) => (
                  <button
                    key={rm.id}
                    onClick={() => handleSelectMonument(rm.id)}
                    className="p-2.5 rounded-2xl border border-white/10 bg-white/5 hover:border-amber-400 hover:bg-white/10 transition text-left cursor-pointer space-y-1.5 group"
                  >
                    <div className="h-20 w-full rounded-xl overflow-hidden bg-black border border-white/5 relative">
                      <img
                        src={rm.photos[0]?.url || ('/images/monuments/' + rm.id + '.jpg')}
                        alt={rm.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <h5 className="font-display text-xs font-bold text-white truncate group-hover:text-amber-300">{rm.name}</h5>
                    <p className="text-[10px] text-amber-300 font-mono truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0 text-amber-400" />
                      <span>{rm.city}, {rm.state}</span>
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
