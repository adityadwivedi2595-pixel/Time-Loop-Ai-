'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ThenAndNowComparison } from '@/data/indian-monuments';
import { speakHeritageText, stopUniversalAudio } from '@/lib/heritage-voice';
import { 
  History, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

interface HistoricalComparisonSliderProps {
  comparison: ThenAndNowComparison;
  monumentName: string;
  language?: 'hi' | 'en';
}

export function HistoricalComparisonSlider({
  comparison,
  monumentName,
  language = 'hi'
}: HistoricalComparisonSliderProps) {
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const [showBlueprintGrid, setShowBlueprintGrid] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(clampedPct);
  }, []);

  const handleMouseDown = () => { isDraggingRef.current = true; };
  const handleTouchStart = () => { isDraggingRef.current = true; };
  const handleMouseUp = () => { isDraggingRef.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    handleMove(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleSpeakComparison = () => {
    if (isSpeaking) {
      stopUniversalAudio();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = language === 'hi'
      ? `${monumentName} का पुराना जमाना बनाम नया दौर। ऐतिहासिक दौर: ${comparison.thenYear}। ${comparison.thenCaption} आधुनिक दौर: ${comparison.nowYear}। ${comparison.nowCaption} ${comparison.historicalContext || ''} ${comparison.restorationNotes || ''}`
      : `Historical Archival Comparison for ${monumentName}. Archival era: ${comparison.thenYear}. ${comparison.thenCaption}. Modern conservation: ${comparison.nowYear}. ${comparison.nowCaption}. ${comparison.historicalContext || ''} ${comparison.restorationNotes || ''}`;

    setIsSpeaking(true);
    speakHeritageText(
      textToSpeak,
      language,
      'female',
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="w-full rounded-3xl border border-white/15 bg-gradient-to-b from-[#080d1e] via-[#02050f] to-black p-5 sm:p-7 space-y-5 shadow-2xl">
      {/* Top Slide HUD Header matching Slide 6 */}
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs font-black tracking-widest border border-purple-400/40">
              06 • TIME-TRAVEL ARCHIVES
            </span>
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest hidden sm:inline">
              1858–1947 Archives vs Modern Conservation
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Blueprint Grid Toggle */}
            <button
              onClick={() => setShowBlueprintGrid(!showBlueprintGrid)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono transition cursor-pointer border ${
                showBlueprintGrid
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{showBlueprintGrid ? 'Blueprint Grid ON' : 'Grid OFF'}</span>
            </button>

            {/* Audio Listen Button */}
            <button
              onClick={handleSpeakComparison}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                isSpeaking
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-glow-cyan animate-pulse'
                  : 'bg-white/10 text-amber-300 border-amber-400/40 hover:bg-amber-500 hover:text-black'
              }`}
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span>{isSpeaking ? (language === 'hi' ? 'बोल रहा है...' : 'Speaking...') : (language === 'hi' ? 'आर्काइव सुनें' : 'Listen Archives')}</span>
            </button>
          </div>
        </div>

        {/* Big Bold Slide Title with Amber Underline */}
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            {language === 'hi' ? 'पुराना जमाना vs नया दौर: समय यात्रा आर्काइव' : 'TIME-TRAVEL ARCHIVAL COMPARISON: THEN vs NOW'}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-amber-400 rounded-full mt-1.5 mb-2" />
          <p className="text-xs sm:text-sm font-mono text-gray-300">
            1858–1947 archives: Samuel Bourne • Felice Beato • Lala Deen Dayal • ASI | 1942 Taj camouflage • 1903 Konark sand conservation • 1857 Red Fort aftermath
          </p>
        </div>
      </div>

      {/* Quick Position Jump Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-mono text-gray-400">
          ◀ स्लाइडर को खींचकर ऐतिहासिक अंतर देखें ▶
        </span>

        <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 rounded-xl p-1 text-[11px] font-mono">
          <button
            onClick={() => setSliderPos(100)}
            className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
              sliderPos >= 90 ? 'bg-amber-500 text-black shadow-glow-amber' : 'text-gray-400 hover:text-white'
            }`}
          >
            📜 पूरा पुराना दौर ({comparison.thenYear.split(' ')[0]})
          </button>
          <button
            onClick={() => setSliderPos(50)}
            className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
              sliderPos > 30 && sliderPos < 70 ? 'bg-purple-500 text-white shadow-glow-purple' : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚖️ 50/50 तुलना
          </button>
          <button
            onClick={() => setSliderPos(0)}
            className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
              sliderPos <= 10 ? 'bg-cyan-500 text-black shadow-glow-cyan' : 'text-gray-400 hover:text-white'
            }`}
          >
            ✨ वर्तमान स्वरूप ({comparison.nowYear.split(' ')[0]})
          </button>
        </div>
      </div>

      {/* Interactive Comparison Split Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[340px] sm:h-[480px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/20 bg-black shadow-2xl"
      >
        {/* RIGHT IMAGE (MODERN / NOW) */}
        <img
          src={comparison.nowUrl}
          alt={`Modern photograph of ${monumentName}`}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Blueprint Wireframe Grid Lines Overlay */}
        {showBlueprintGrid && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 240, 255, 0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 240, 255, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        )}

        {/* LEFT IMAGE (ARCHIVAL / THEN) with Dynamic Polygon Clip Path */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <img
            src={comparison.thenUrl}
            alt={`Historical archival photograph of ${monumentName}`}
            className="w-full h-full object-cover filter sepia-[0.35] contrast-[1.12] pointer-events-none"
          />

          {/* Archival Grain Texture Overlay */}
          <div className="absolute inset-0 bg-amber-950/20 mix-blend-color-burn pointer-events-none" />
        </div>

        {/* Draggable Vertical Divider Line */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none flex items-center justify-center -translate-x-1/2"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Vertical Glowing Line */}
          <div className="w-1.5 h-full bg-gradient-to-b from-amber-400 via-white to-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.9)]" />

          {/* Central Handle Button */}
          <div className="absolute top-1/2 -translate-y-1/2 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/95 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-glow-cyan backdrop-blur-md">
            <div className="flex items-center gap-0.5 text-xs font-black">
              <ChevronLeft className="h-4 w-4 text-amber-400" />
              <ChevronRight className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Floating THEN Badge (Top Left) */}
        <div className="absolute top-4 left-4 z-10 px-3.5 py-2 rounded-2xl bg-black/85 border border-amber-500/50 backdrop-blur-md shadow-xl pointer-events-none max-w-xs">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-mono font-black text-amber-300 uppercase tracking-wider">
              📜 पुराना जमाना: {comparison.thenYear}
            </span>
          </div>
          <p className="text-[10px] text-gray-300 font-mono truncate mt-0.5">
            {comparison.thenPhotographer || 'Historical Archival Record'}
          </p>
        </div>

        {/* Floating NOW Badge (Top Right) */}
        <div className="absolute top-4 right-4 z-10 px-3.5 py-2 rounded-2xl bg-black/85 border border-cyan-500/50 backdrop-blur-md shadow-xl pointer-events-none text-right max-w-xs">
          <div className="flex items-center justify-end gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs font-mono font-black text-cyan-300 uppercase tracking-wider">
              ✨ आधुनिक दौर: {comparison.nowYear}
            </span>
          </div>
          <p className="text-[10px] text-cyan-300 font-mono truncate mt-0.5">
            ASI & UNESCO Scientific Restoration
          </p>
        </div>
      </div>

      {/* Historical Context & Restoration Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-1.5 shadow-lg">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-mono">
            <Clock className="h-4 w-4" />
            <span>ऐतिहासिक आर्काइव पृष्ठभूमि ({comparison.thenYear})</span>
          </div>
          <p className="text-xs text-gray-200 leading-relaxed">
            {comparison.thenCaption}
          </p>
          {comparison.historicalContext && (
            <p className="text-[11px] text-amber-200/80 font-mono pt-1 border-t border-amber-500/20 mt-2">
              🏛️ {comparison.historicalContext}
            </p>
          )}
        </div>

        <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-1.5 shadow-lg">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold font-mono">
            <ShieldCheck className="h-4 w-4" />
            <span>वर्तमान वैज्ञानिक संरक्षण स्थिति ({comparison.nowYear})</span>
          </div>
          <p className="text-xs text-gray-200 leading-relaxed">
            {comparison.nowCaption}
          </p>
          {comparison.restorationNotes && (
            <p className="text-[11px] text-cyan-200/80 font-mono pt-1 border-t border-cyan-500/20 mt-2">
              🔬 {comparison.restorationNotes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
