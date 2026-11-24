'use client';

import React, { useState, useEffect } from 'react';
import { IndianMonument } from '@/data/indian-monuments';
import { getMonumentSpecs } from '@/data/heritage-specs-data';
import { speakHeritageText, stopUniversalAudio } from '@/lib/heritage-voice';
import { 
  Layers, 
  Droplets, 
  ThermometerSnowflake, 
  Footprints, 
  Volume2, 
  Maximize2, 
  Sparkles,
  Info,
  Compass,
  X
} from 'lucide-react';

interface SubterraneanSecretsSectionProps {
  monument: IndianMonument;
  language?: 'hi' | 'en';
}

export function SubterraneanSecretsSection({
  monument,
  language = 'hi'
}: SubterraneanSecretsSectionProps) {
  const dossier = getMonumentSpecs(monument.id);
  const sub = dossier.subterranean;

  const [activeTab, setActiveTab] = useState<'wells' | 'cooling' | 'escape' | 'water'>('wells');
  const [isSpeakingFull, setIsSpeakingFull] = useState<boolean>(false);
  const [speakingTab, setSpeakingTab] = useState<string | null>(null);
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<'male' | 'female'>('male');
  const [isCutawayModalOpen, setIsCutawayModalOpen] = useState<boolean>(false);

  // Isolate cutaway artwork: Taj Mahal gets the authentic subterranean cutaway graphic;
  // all other monuments strictly use their own authentic verified photo with blueprint HUD.
  const cutawayImage = monument.id === 'taj-mahal'
    ? '/images/slides/slide-05-subterranean-cutaway.jpg'
    : (monument.photos[1]?.url || monument.photos[0]?.url || `/images/monuments/${monument.id}.jpg`);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('timeloop_voice_gender');
      if (saved === 'female' || saved === 'male') setSelectedVoiceGender(saved);
    } catch {}
  }, []);

  useEffect(() => {
    stopUniversalAudio();
    setIsSpeakingFull(false);
    setSpeakingTab(null);
    setActiveTab('wells');
  }, [monument.id]);

  // Handle playing the entire subterranean audio overview
  const handleSpeakSubterraneanFull = () => {
    if (isSpeakingFull) {
      stopUniversalAudio();
      setIsSpeakingFull(false);
      setSpeakingTab(null);
      return;
    }

    const textToSpeak = language === 'hi'
      ? `${sub.cutawayHeadlineHi}। ${sub.wellSystemHi} ${sub.coolingSystemHi} ${sub.escapeRoutesHi} ${sub.waterEngineeringHi}`
      : `${sub.cutawayHeadlineEn}. ${sub.wellSystemEn} ${sub.coolingSystemEn} ${sub.escapeRoutesEn} ${sub.waterEngineeringEn}`;

    setIsSpeakingFull(true);
    setSpeakingTab('full');
    speakHeritageText(
      textToSpeak,
      language,
      selectedVoiceGender,
      () => {
        setIsSpeakingFull(true);
        setSpeakingTab('full');
      },
      () => {
        setIsSpeakingFull(false);
        setSpeakingTab(null);
      }
    );
  };

  // Handle playing individual card audio
  const handlePlayCardAudio = (tab: 'wells' | 'cooling' | 'escape' | 'water', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (speakingTab === tab) {
      stopUniversalAudio();
      setSpeakingTab(null);
      setIsSpeakingFull(false);
      return;
    }

    setActiveTab(tab);

    let text = '';
    if (tab === 'wells') {
      text = language === 'hi' ? sub.wellSystemHi : sub.wellSystemEn;
    } else if (tab === 'cooling') {
      text = language === 'hi' ? sub.coolingSystemHi : sub.coolingSystemEn;
    } else if (tab === 'escape') {
      text = language === 'hi' ? sub.escapeRoutesHi : sub.escapeRoutesEn;
    } else if (tab === 'water') {
      text = language === 'hi' ? sub.waterEngineeringHi : sub.waterEngineeringEn;
    }

    setSpeakingTab(tab);
    setIsSpeakingFull(false);
    speakHeritageText(
      text,
      language,
      selectedVoiceGender,
      () => setSpeakingTab(tab),
      () => setSpeakingTab(null)
    );
  };

  // Dynamic monument-tailored card metrics and titles
  const getCard1Metric = () => {
    if (monument.id === 'taj-mahal') return '180 WELLS';
    if (monument.id === 'hawa-mahal') return '20 CM BALANCE';
    if (monument.id === 'konark-sun-temple') return '52-TON CAPSTONE';
    if (monument.id === 'delhi-red-fort') return 'ASAD BURJ RAFT';
    if (monument.id === 'qutub-minar') return 'GUPTA IRON PILLAR';
    return 'FOUNDATION RAFT';
  };

  const getCard4Metric = () => {
    if (monument.id === 'taj-mahal' || monument.id === 'delhi-red-fort') return 'NAHR-I-BIHISHT';
    if (monument.id === 'konark-sun-temple') return 'CHANDRABHAGA CANALS';
    if (monument.id === 'hawa-mahal') return 'BAORI CHANNELS';
    if (monument.id === 'rani-ki-vav') return 'GEOTHERMAL RESERVOIR';
    return 'HYDRAULIC CHANNELS';
  };

  return (
    <section className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-[#030717] via-[#020510] to-black p-5 sm:p-7 space-y-6 shadow-2xl overflow-hidden">
      {/* Top Slide HUD Header matching Slide 05 */}
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-black tracking-widest border border-amber-400/40">
              05 • ARCHITECTURAL CUTAWAY
            </span>
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest hidden sm:inline">
              Subterranean Secrets & Ancient Foundations
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen Cutaway Zoom */}
            <button
              onClick={() => setIsCutawayModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-400/40 text-xs font-mono transition cursor-pointer"
              title="Inspect full-resolution subterranean cutaway"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>{language === 'hi' ? 'कटअवे बड़ा करें' : 'Inspect HD Cutaway'}</span>
            </button>

            {/* Full Audio Spoken Guide Button */}
            <button
              onClick={handleSpeakSubterraneanFull}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                isSpeakingFull
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-glow-cyan animate-pulse'
                  : 'bg-white/10 text-cyan-300 border-cyan-400/40 hover:bg-cyan-500 hover:text-black'
              }`}
            >
              <Volume2 className="h-4 w-4" />
              <span>
                {isSpeakingFull
                  ? (language === 'hi' ? 'आवाज़ चल रही है...' : 'Speaking...')
                  : (language === 'hi' ? 'संपूर्ण नींव का रहस्य सुनें' : 'Listen Foundation Secrets')}
              </span>
            </button>
          </div>
        </div>

        {/* Big Bold Slide Title with Amber Underline */}
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            {language === 'hi' ? 'नींव के भूमिगत रहस्य व प्राचीन इंजीनियरिंग' : 'SUBTERRANEAN SECRETS & ANCIENT FOUNDATIONS'}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full mt-1.5 mb-2" />
          <p className="text-xs sm:text-sm font-mono text-gray-300">
            {language === 'hi'
              ? `${monument.name}: भूमिगत संरचना, भूतापीय शीतलन, गुप्त मार्ग व प्राचीन जल प्रणाली`
              : `${monument.name}: Subsurface bedrock foundations, passive geothermal cooling, escape routes & hydraulics`}
          </p>
        </div>
      </div>

      {/* Visual Subterranean Cutaway Visual Graphic Banner (Slide 05 Artwork) */}
      <div 
        className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-amber-500/40 bg-black group shadow-glow-amber cursor-pointer"
        onClick={() => setIsCutawayModalOpen(true)}
      >
        {/* Background High-Detail Cutaway Artwork */}
        <img
          src={cutawayImage}
          alt={`${monument.name} Subterranean Cutaway`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />

        {/* Blueprint Cutaway Technical Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, transparent 30%, black 90%),
              linear-gradient(to right, rgba(245, 158, 11, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(245, 158, 11, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px'
          }}
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60 pointer-events-none" />

        {/* Top Header Markers on Graphic */}
        <div className="relative z-10 p-3 sm:p-5 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-amber-400/60 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
            ⚓ {sub.foundationType}
          </span>
          <span className="text-[10px] font-mono text-cyan-300 bg-black/80 px-2.5 py-1 rounded-lg border border-cyan-400/40">
            CROSS-SECTION STRATA • ACTIVE: {activeTab.toUpperCase()}
          </span>
        </div>

        {/* INTERACTIVE RADAR HOTSPOT PINS ON CUTAWAY */}
        {/* Pin 1: Wells / Raft (Left) */}
        <div 
          style={{ left: '22%', top: '65%' }}
          onClick={(e) => {
            e.stopPropagation();
            handlePlayCardAudio('wells');
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin cursor-pointer"
          title="Click to inspect Foundation Wells"
        >
          <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
            activeTab === 'wells' 
              ? 'bg-amber-500 text-black shadow-glow-amber ring-4 ring-amber-400/50 scale-125' 
              : 'bg-black/80 border border-amber-400 text-amber-300 hover:scale-110'
          }`}>
            <span className="text-[10px] font-black">1</span>
          </div>
          <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-black/90 border border-amber-400/40 text-[9px] font-mono text-amber-300 opacity-0 group-hover/pin:opacity-100 transition pointer-events-none">
            {getCard1Metric()}
          </span>
        </div>

        {/* Pin 2: Passive Cooling Stepwell (Right) */}
        <div 
          style={{ left: '82%', top: '62%' }}
          onClick={(e) => {
            e.stopPropagation();
            handlePlayCardAudio('cooling');
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin cursor-pointer"
          title="Click to inspect -10°C Cooling"
        >
          <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
            activeTab === 'cooling' 
              ? 'bg-cyan-500 text-black shadow-glow-cyan ring-4 ring-cyan-400/50 scale-125' 
              : 'bg-black/80 border border-cyan-400 text-cyan-300 hover:scale-110'
          }`}>
            <span className="text-[10px] font-black">2</span>
          </div>
          <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-black/90 border border-cyan-400/40 text-[9px] font-mono text-cyan-300 opacity-0 group-hover/pin:opacity-100 transition pointer-events-none">
            -10°C COOLING
          </span>
        </div>

        {/* Pin 3: Escape Tunnels (Middle) */}
        <div 
          style={{ left: '50%', top: '56%' }}
          onClick={(e) => {
            e.stopPropagation();
            handlePlayCardAudio('escape');
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin cursor-pointer"
          title="Click to inspect Escape Routes"
        >
          <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
            activeTab === 'escape' 
              ? 'bg-purple-500 text-white shadow-glow-purple ring-4 ring-purple-400/50 scale-125' 
              : 'bg-black/80 border border-purple-400 text-purple-300 hover:scale-110'
          }`}>
            <span className="text-[10px] font-black">3</span>
          </div>
          <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-black/90 border border-purple-400/40 text-[9px] font-mono text-purple-300 opacity-0 group-hover/pin:opacity-100 transition pointer-events-none">
            ESCAPE ROUTES
          </span>
        </div>

        {/* Pin 4: Water Canal (Mid-Right) */}
        <div 
          style={{ left: '71%', top: '46%' }}
          onClick={(e) => {
            e.stopPropagation();
            handlePlayCardAudio('water');
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin cursor-pointer"
          title="Click to inspect Water Engineering"
        >
          <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
            activeTab === 'water' 
              ? 'bg-emerald-500 text-black shadow-glow-emerald ring-4 ring-emerald-400/50 scale-125' 
              : 'bg-black/80 border border-emerald-400 text-emerald-300 hover:scale-110'
          }`}>
            <span className="text-[10px] font-black">4</span>
          </div>
          <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-black/90 border border-emerald-400/40 text-[9px] font-mono text-emerald-300 opacity-0 group-hover/pin:opacity-100 transition pointer-events-none">
            {getCard4Metric()}
          </span>
        </div>

        {/* Bottom Callout Overlay */}
        <div className="relative z-10 p-3 sm:p-5 mt-auto flex items-end justify-between">
          <div className="p-3.5 rounded-2xl bg-black/90 backdrop-blur-md border border-white/20 max-w-xl">
            <h4 className="font-display text-xs sm:text-sm font-bold text-amber-300">
              {language === 'hi' ? sub.cutawayHeadlineHi : sub.cutawayHeadlineEn}
            </h4>
            <p className="text-xs text-gray-200 mt-1 line-clamp-2">
              {activeTab === 'wells' && (language === 'hi' ? sub.wellSystemHi : sub.wellSystemEn)}
              {activeTab === 'cooling' && (language === 'hi' ? sub.coolingSystemHi : sub.coolingSystemEn)}
              {activeTab === 'escape' && (language === 'hi' ? sub.escapeRoutesHi : sub.escapeRoutesEn)}
              {activeTab === 'water' && (language === 'hi' ? sub.waterEngineeringHi : sub.waterEngineeringEn)}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Interactive Feature Cards matching Slide 5 Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Foundation Wells / Raft */}
        <div
          onClick={() => setActiveTab('wells')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeTab === 'wells'
              ? 'border-amber-400 bg-amber-950/40 shadow-glow-amber ring-1 ring-amber-400/50'
              : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-display font-black text-amber-400 uppercase tracking-wide">
              {getCard1Metric()}
            </span>
            <button
              onClick={(e) => handlePlayCardAudio('wells', e)}
              className={`p-1.5 rounded-lg border transition ${
                speakingTab === 'wells'
                  ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                  : 'bg-white/10 hover:bg-amber-500 hover:text-black border-white/15 text-amber-300'
              }`}
              title="Listen to foundation wells secret"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <h5 className="font-display text-xs font-bold text-white group-hover:text-amber-300">
            {language === 'hi' ? 'नींव व काष्ठ/शिला आधार' : 'Subterranean Foundation'}
          </h5>
          <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-mono">
            {language === 'hi' ? sub.wellSystemHi : sub.wellSystemEn}
          </p>
        </div>

        {/* Card 2: -10°C Passive Cooling */}
        <div
          onClick={() => setActiveTab('cooling')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeTab === 'cooling'
              ? 'border-cyan-400 bg-cyan-950/40 shadow-glow-cyan ring-1 ring-cyan-400/50'
              : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-display font-black text-cyan-400 uppercase tracking-wide">
              -10°C COOLING
            </span>
            <button
              onClick={(e) => handlePlayCardAudio('cooling', e)}
              className={`p-1.5 rounded-lg border transition ${
                speakingTab === 'cooling'
                  ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                  : 'bg-white/10 hover:bg-cyan-500 hover:text-black border-white/15 text-cyan-300'
              }`}
              title="Listen to geothermal cooling secret"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <h5 className="font-display text-xs font-bold text-white group-hover:text-cyan-300">
            {language === 'hi' ? 'प्राकृतिक भूतापीय शीतलन' : 'Passive Geothermal Cooling'}
          </h5>
          <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-mono">
            {language === 'hi' ? sub.coolingSystemHi : sub.coolingSystemEn}
          </p>
        </div>

        {/* Card 3: Escape Routes */}
        <div
          onClick={() => setActiveTab('escape')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeTab === 'escape'
              ? 'border-purple-400 bg-purple-950/40 shadow-glow-purple ring-1 ring-purple-400/50'
              : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-display font-black text-purple-400 uppercase tracking-wide">
              ESCAPE ROUTES
            </span>
            <button
              onClick={(e) => handlePlayCardAudio('escape', e)}
              className={`p-1.5 rounded-lg border transition ${
                speakingTab === 'escape'
                  ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                  : 'bg-white/10 hover:bg-purple-500 hover:text-black border-white/15 text-purple-300'
              }`}
              title="Listen to escape routes secret"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <h5 className="font-display text-xs font-bold text-white group-hover:text-purple-300">
            {language === 'hi' ? 'शाही गुप्त निकासी सुरंगे' : 'Royal Evacuation Tunnels'}
          </h5>
          <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-mono">
            {language === 'hi' ? sub.escapeRoutesHi : sub.escapeRoutesEn}
          </p>
        </div>

        {/* Card 4: Water Engineering / Channels */}
        <div
          onClick={() => setActiveTab('water')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeTab === 'water'
              ? 'border-emerald-400 bg-emerald-950/40 shadow-glow-emerald ring-1 ring-emerald-400/50'
              : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-display font-black text-emerald-400 uppercase tracking-wide">
              {getCard4Metric()}
            </span>
            <button
              onClick={(e) => handlePlayCardAudio('water', e)}
              className={`p-1.5 rounded-lg border transition ${
                speakingTab === 'water'
                  ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                  : 'bg-white/10 hover:bg-emerald-500 hover:text-black border-white/15 text-emerald-300'
              }`}
              title="Listen to hydraulic water engineering secret"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <h5 className="font-display text-xs font-bold text-white group-hover:text-emerald-300">
            {language === 'hi' ? 'जल वातानुकूलन प्रणाली' : 'Hydraulic Air Conditioning'}
          </h5>
          <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-mono">
            {language === 'hi' ? sub.waterEngineeringHi : sub.waterEngineeringEn}
          </p>
        </div>
      </div>

      {/* FULL RESOLUTION CUTAWAY MODAL */}
      {isCutawayModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6"
          onClick={() => setIsCutawayModalOpen(false)}
        >
          <div className="w-full flex items-center justify-between text-white border-b border-white/15 pb-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-black tracking-widest border border-amber-400/40">
                05 • ARCHITECTURAL CUTAWAY
              </span>
              <h3 className="text-base sm:text-lg font-display font-black text-white mt-1">
                {language === 'hi' ? 'नींव के भूमिगत रहस्य व प्राचीन इंजीनियरिंग' : 'SUBTERRANEAN SECRETS & ANCIENT FOUNDATIONS'}
              </h3>
            </div>
            <button
              onClick={() => setIsCutawayModalOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div 
            className="relative max-w-6xl max-h-[78vh] w-full flex items-center justify-center my-auto overflow-hidden rounded-2xl border border-amber-500/40 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={cutawayImage}
              alt={`${monument.name} Subterranean Cutaway HD`}
              className="max-h-[78vh] max-w-full object-contain shadow-2xl"
            />
          </div>

          <div className="w-full max-w-4xl text-center p-3 rounded-2xl bg-black/85 border border-white/15">
            <p className="text-xs text-gray-200 font-mono">
              {getCard1Metric()} • {language === 'hi' ? 'प्राकृतिक भूतापीय शीतलन' : '-10°C Geothermal Stepwell Cooling'} • {language === 'hi' ? 'शाही आपातकालीन सुरंगे' : 'Royal Escape Corridors'} • {getCard4Metric()}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
