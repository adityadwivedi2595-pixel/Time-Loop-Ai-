'use client';

import React, { useState, useEffect } from 'react';
import { IndianMonument } from '@/data/indian-monuments';
import { getMonumentSpecs, MonumentBlueprintSpec } from '@/data/heritage-specs-data';
import { speakHeritageText, stopUniversalAudio } from '@/lib/heritage-voice';
import { 
  Compass, 
  Volume2, 
  Layers, 
  Maximize2, 
  Sparkles, 
  Ruler, 
  Clock, 
  Wind, 
  ShieldCheck, 
  Waves, 
  Cpu, 
  Camera, 
  ZoomIn, 
  X,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const MONUMENT_SLIDE_ARTWORKS: Record<string, string> = {
  'taj-mahal': '/images/slides/slide-09-taj-mahal-blueprint.jpg',
  'hawa-mahal': '/images/slides/slide-10-hawa-mahal-aerodynamics.jpg',
  'konark-sun-temple': '/images/slides/slide-11-konark-chronometer.jpg',
  'delhi-red-fort': '/images/slides/slide-12-red-fort-qutub-minar.jpg',
  'qutub-minar': '/images/slides/slide-12-red-fort-qutub-minar.jpg',
};

interface ArchitecturalSpecsBlueprintProps {
  monument: IndianMonument;
  language?: 'hi' | 'en';
}

export function ArchitecturalSpecsBlueprint({
  monument,
  language = 'hi'
}: ArchitecturalSpecsBlueprintProps) {
  const dossier = getMonumentSpecs(monument.id);
  const specs = dossier.specs;

  const hasHighDetailSlide = Boolean(MONUMENT_SLIDE_ARTWORKS[monument.id]);
  const [viewMode, setViewMode] = useState<'blueprint' | 'photo'>(
    hasHighDetailSlide ? 'blueprint' : 'photo'
  );
  const [activeSpecIndex, setActiveSpecIndex] = useState<number>(0);
  const [isSpeakingIndex, setIsSpeakingIndex] = useState<number | null>(null);
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<'male' | 'female'>('male');
  const [showWireframeGrid, setShowWireframeGrid] = useState<boolean>(true);
  const [expandedSpecIndex, setExpandedSpecIndex] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    monument.photos[0]?.url || `/images/monuments/${monument.id}.jpg`
  );
  const [selectedPhotoTitle, setSelectedPhotoTitle] = useState<string>(
    monument.photos[0]?.title || `${monument.name} Exterior Facade`
  );
  const [selectedPhotoCaption, setSelectedPhotoCaption] = useState<string>(
    monument.photos[0]?.caption || ''
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('timeloop_voice_gender');
      if (saved === 'female' || saved === 'male') setSelectedVoiceGender(saved);
    } catch {}
  }, []);

  // Reset state cleanly whenever the monument changes
  useEffect(() => {
    stopUniversalAudio();
    setIsSpeakingIndex(null);
    setActiveSpecIndex(0);
    setExpandedSpecIndex(null);
    setViewMode(hasHighDetailSlide ? 'blueprint' : 'photo');
    const initialPhoto = specs[0]?.highlightPhotoUrl || monument.photos[0]?.url || `/images/monuments/${monument.id}.jpg`;
    setSelectedPhoto(initialPhoto);
    setSelectedPhotoTitle(monument.photos[0]?.title || `${monument.name} Architecture`);
    setSelectedPhotoCaption(monument.photos[0]?.caption || '');
  }, [monument.id, hasHighDetailSlide, specs]);

  const handleSelectSpec = (idx: number) => {
    setActiveSpecIndex(idx);
    const spec = specs[idx];
    if (!spec) return;

    const targetPhoto = spec.highlightPhotoUrl || monument.photos[idx % monument.photos.length]?.url;
    if (targetPhoto) {
      setSelectedPhoto(targetPhoto);
      const matchingPhotoObj = monument.photos.find((p) => p.url === targetPhoto);
      if (matchingPhotoObj) {
        setSelectedPhotoTitle(matchingPhotoObj.title);
        setSelectedPhotoCaption(matchingPhotoObj.caption);
      } else {
        setSelectedPhotoTitle(language === 'hi' ? spec.titleHi : spec.titleEn);
        setSelectedPhotoCaption(language === 'hi' ? spec.summaryHi : spec.summaryEn);
      }
    }
  };

  const handlePlaySpecAudio = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (isSpeakingIndex === index) {
      stopUniversalAudio();
      setIsSpeakingIndex(null);
      return;
    }

    const spec = specs[index];
    if (!spec) return;

    handleSelectSpec(index);

    const textToSpeak = language === 'hi'
      ? `${spec.titleHi}। ${spec.summaryHi} ${spec.detailHi}`
      : `${spec.titleEn}. ${spec.summaryEn} ${spec.detailEn}`;

    setIsSpeakingIndex(index);
    speakHeritageText(
      textToSpeak,
      language,
      selectedVoiceGender,
      () => setIsSpeakingIndex(index),
      () => setIsSpeakingIndex(null)
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'LOGISTICS': return <Ruler className="h-3.5 w-3.5 text-amber-400" />;
      case 'MATERIAL': return <Sparkles className="h-3.5 w-3.5 text-cyan-400" />;
      case 'ACOUSTICS': return <Volume2 className="h-3.5 w-3.5 text-emerald-400" />;
      case 'FOUNDATION': return <Layers className="h-3.5 w-3.5 text-amber-500" />;
      case 'AERODYNAMICS': return <Wind className="h-3.5 w-3.5 text-sky-400" />;
      case 'CHRONOMETRY': return <Clock className="h-3.5 w-3.5 text-yellow-400" />;
      case 'METALLURGY': return <Cpu className="h-3.5 w-3.5 text-purple-400" />;
      case 'SEISMIC': return <ShieldCheck className="h-3.5 w-3.5 text-rose-400" />;
      case 'HYDRAULIC': return <Waves className="h-3.5 w-3.5 text-blue-400" />;
      default: return <Compass className="h-3.5 w-3.5 text-cyan-400" />;
    }
  };

  const currentActiveSpec = specs[activeSpecIndex] || specs[0];
  const highDetailSlideUrl = MONUMENT_SLIDE_ARTWORKS[monument.id];

  return (
    <section className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-[#060c1d] via-[#02050f] to-black p-5 sm:p-7 space-y-6 shadow-2xl overflow-hidden">
      {/* Top Slide HUD Header matching Presentation Slides 9-12 */}
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-xs font-black tracking-widest border border-cyan-400/40">
              ARCHITECTURAL DOSSIER
            </span>
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest hidden sm:inline">
              Engineered Blueprints & Material Science
            </span>
          </div>

          {/* High Detail Mode Toggle & Zoom Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {highDetailSlideUrl && (
              <div className="flex items-center rounded-xl bg-black/60 border border-cyan-400/30 p-0.5">
                <button
                  onClick={() => setViewMode('blueprint')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    viewMode === 'blueprint'
                      ? 'bg-cyan-500 text-black shadow-glow-cyan'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>3D Blueprint Scan</span>
                </button>
                <button
                  onClick={() => setViewMode('photo')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    viewMode === 'photo'
                      ? 'bg-cyan-500 text-black shadow-glow-cyan'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Real Photo Scan</span>
                </button>
              </div>
            )}

            {/* Wireframe Grid Toggle */}
            <button
              onClick={() => setShowWireframeGrid(!showWireframeGrid)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono transition cursor-pointer border ${
                showWireframeGrid
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
              title="Toggle Architectural Blueprint Wireframe Overlay"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{showWireframeGrid ? 'Grid ON' : 'Grid OFF'}</span>
            </button>

            <button
              onClick={() => setIsLightboxOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-400/40 text-xs font-mono transition cursor-pointer"
              title="Inspect detail photo in full resolution"
            >
              <ZoomIn className="h-3.5 w-3.5" />
              <span>{language === 'hi' ? 'फोटो बड़ा करें' : 'Inspect HD'}</span>
            </button>
          </div>
        </div>

        {/* Big Bold Monument Title with Amber Underline */}
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            {monument.name}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full mt-1.5 mb-2" />
          <p className="text-xs sm:text-sm font-mono text-cyan-300">
            {monument.city}, {monument.state} • {monument.historicalPeriod} • {monument.dynastyOrBuilder}
          </p>
        </div>
      </div>

      {/* Main Two-Column Architectural Blueprint Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Visual Holographic Blueprint Photo Screen (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-cyan-400/40 bg-black overflow-hidden relative group min-h-[380px] sm:min-h-[460px] shadow-glow-cyan">
          {/* Main Visual Image (Switches between High-Detail 3D Blueprint & Real Photo) */}
          <img
            src={viewMode === 'blueprint' && highDetailSlideUrl ? highDetailSlideUrl : selectedPhoto}
            alt={selectedPhotoTitle}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
          />

          {/* Blueprint Wireframe Grid Lines Overlay */}
          {showWireframeGrid && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-35 mix-blend-screen"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0, 240, 255, 0.16) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0, 240, 255, 0.16) 1px, transparent 1px)
                `,
                backgroundSize: '36px 36px'
              }}
            />
          )}

          {/* Center Crosshair Optical Mark */}
          {showWireframeGrid && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div className="h-24 w-24 rounded-full border border-cyan-400/60 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-cyan-400" />
              </div>
            </div>
          )}

          {/* Dark Vignette Overlays for Technical Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/60 pointer-events-none" />

          {/* Top Blueprint Technical Status HUD */}
          <div className="relative z-10 p-4 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-cyan-400/50 text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>{monument.coordinates || '27.1751° N, 78.0421° E'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-amber-400/50 text-amber-300 font-bold uppercase">
                {currentActiveSpec?.category || 'STRUCTURAL'} SCAN
              </span>
            </div>
          </div>

          {/* Architectural Overlay Target Box at Bottom */}
          <div className="relative z-10 p-4 mt-auto space-y-2">
            <div className="p-3.5 rounded-2xl bg-black/90 backdrop-blur-md border border-white/20 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  {getCategoryIcon(currentActiveSpec?.category || 'LOGISTICS')}
                  <span>{currentActiveSpec?.metric}</span>
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-semibold">
                  {viewMode === 'blueprint' && highDetailSlideUrl 
                    ? (language === 'hi' ? '3D ब्लू-प्रिंट इंजीनियरिंग स्कैन' : '3D Blueprint Engineering Scan')
                    : selectedPhotoTitle}
                </span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed font-mono">
                {selectedPhotoCaption || (language === 'hi' ? currentActiveSpec?.summaryHi : currentActiveSpec?.summaryEn)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Deep Spec Cards (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            {specs.map((spec, idx) => {
              const isActive = activeSpecIndex === idx;
              const isSpeaking = isSpeakingIndex === idx;
              const isExpanded = expandedSpecIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectSpec(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isActive
                      ? 'border-cyan-400 bg-cyan-950/45 shadow-glow-cyan ring-1 ring-cyan-400/40'
                      : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  {/* Left glowing indicator accent bar */}
                  <div 
                    className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                      isActive ? 'bg-gradient-to-b from-amber-400 to-cyan-400' : 'bg-transparent group-hover:bg-white/20'
                    }`} 
                  />

                  {/* Header: Metric & Play Audio Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-display font-black tracking-wide text-amber-400 uppercase block">
                        {spec.metric}
                      </span>
                      <h4 className="font-display text-xs font-bold text-white group-hover:text-cyan-300 transition">
                        {language === 'hi' ? spec.titleHi : spec.titleEn}
                      </h4>
                    </div>

                    {/* Audio Narration Button */}
                    <button
                      onClick={(e) => handlePlaySpecAudio(idx, e)}
                      className={`p-2 rounded-xl transition cursor-pointer flex-shrink-0 border ${
                        isSpeaking
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-glow-cyan animate-pulse'
                          : 'bg-white/10 hover:bg-cyan-500 hover:text-black border-white/15 text-gray-300'
                      }`}
                      title={isSpeaking ? 'Stop Audio' : 'Listen Spoken Guide'}
                    >
                      {isSpeaking ? (
                        <div className="flex items-center gap-1 text-[10px] font-mono font-black">
                          <Volume2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Playing</span>
                        </div>
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Summary Narration Text */}
                  <p className="text-xs text-gray-300 leading-relaxed mt-1.5">
                    {language === 'hi' ? spec.summaryHi : spec.summaryEn}
                  </p>

                  {/* Expanded Engineering Detail */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-white/15 space-y-1.5 animate-fade-in text-xs text-cyan-200 bg-black/40 p-2.5 rounded-xl">
                      <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                        📐 {language === 'hi' ? 'गहन वास्तुकला विवरण:' : 'Deep Architectural Engineering:'}
                      </span>
                      <p className="leading-relaxed">
                        {language === 'hi' ? spec.detailHi : spec.detailEn}
                      </p>
                    </div>
                  )}

                  {/* Footer Action: Toggle Deep Insight */}
                  <div className="flex items-center justify-between pt-2 mt-1">
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                      {getCategoryIcon(spec.category)}
                      <span>{spec.category}</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedSpecIndex(isExpanded ? null : idx);
                      }}
                      className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-200 transition cursor-pointer"
                    >
                      {isExpanded
                        ? (language === 'hi' ? '▲ कम देखें' : '▲ Show Less')
                        : (language === 'hi' ? '▼ विस्तार से पढ़ें' : '▼ Deep Insight')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DETAIL PHOTO INSPECTOR THUMBNAILS STRIP */}
      {monument.photos && monument.photos.length > 0 && (
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-cyan-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                {language === 'hi' ? 'स्थापत्य विवरण व ऐतिहासिक फोटो गैलरी' : 'Architectural Detail Photos & Historical Archives'}
              </h4>
            </div>
            <span className="text-[10px] font-mono text-gray-400">
              {monument.photos.length} {language === 'hi' ? 'प्रमाणित तस्वीरें' : 'Verified Photos'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {monument.photos.map((photo, pIdx) => {
              const isCurrent = viewMode === 'photo' && selectedPhoto === photo.url;
              return (
                <div
                  key={pIdx}
                  onClick={() => {
                    setViewMode('photo');
                    setSelectedPhoto(photo.url);
                    setSelectedPhotoTitle(photo.title);
                    setSelectedPhotoCaption(photo.caption);
                  }}
                  className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-[4/3] bg-black ${
                    isCurrent
                      ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-glow-cyan'
                      : 'border-white/15 hover:border-cyan-400/60 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-mono text-white truncate font-bold">
                    {photo.category ? `[${photo.category}] ` : ''}{photo.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HIGH-RESOLUTION LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="w-full flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-display font-black text-white">
                {viewMode === 'blueprint' && highDetailSlideUrl ? `${monument.name} 3D Blueprint` : selectedPhotoTitle}
              </h3>
              <p className="text-xs font-mono text-cyan-300">
                {monument.name} • {monument.city}, {monument.state}
              </p>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div 
            className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center my-auto overflow-hidden rounded-2xl border border-cyan-400/30 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={viewMode === 'blueprint' && highDetailSlideUrl ? highDetailSlideUrl : selectedPhoto}
              alt={selectedPhotoTitle}
              className="max-h-[75vh] max-w-full object-contain shadow-2xl"
            />
          </div>

          <div className="w-full max-w-3xl text-center p-3 rounded-2xl bg-black/80 border border-white/15">
            <p className="text-xs text-gray-200 font-mono leading-relaxed">
              {selectedPhotoCaption || `${monument.name} high-detail architectural engineering photograph.`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
