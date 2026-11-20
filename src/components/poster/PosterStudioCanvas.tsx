'use client';

import React, { useRef, useState } from 'react';
import { Download, Sparkles, RefreshCw, Type, Palette } from 'lucide-react';
import { toPng } from 'html-to-image';

interface PosterStudioProps {
  initialTitle: string;
  initialTagline: string;
  initialArtworkUrl: string;
  genre: string;
  eraName: string;
  characterName: string;
}

export function PosterStudioCanvas({
  initialTitle,
  initialTagline,
  initialArtworkUrl,
  genre,
  eraName,
  characterName,
}: PosterStudioProps) {
  const [title, setTitle] = useState(initialTitle);
  const [tagline, setTagline] = useState(initialTagline);
  const [leadStar, setLeadStar] = useState(characterName);
  const [directorCredit, setDirectorCredit] = useState('A TIMELOOP AI ORIGINAL PRODUCTION');
  const [artworkUrl, setArtworkUrl] = useState(initialArtworkUrl);
  const [fontVibe, setFontVibe] = useState<'cinematic' | 'cyber' | 'gothic'>('cinematic');
  const [isExporting, setIsExporting] = useState(false);

  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(posterRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-poster.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export poster:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Poster Canvas Preview (Left 7 cols) */}
      <div className="lg:col-span-7 flex justify-center">
        <div
          ref={posterRef}
          className="relative w-full max-w-[420px] aspect-[2/3] overflow-hidden rounded-2xl border-4 border-white/20 bg-black shadow-2xl flex flex-col justify-between p-8"
          style={{
            backgroundImage: `url(${artworkUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Top Billing Credit */}
          <div className="relative z-10 text-center space-y-1">
            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-300 drop-shadow">
              {directorCredit}
            </p>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/90 drop-shadow">
              STARRING {leadStar}
            </p>
          </div>

          {/* Dark gradient overlay for bottom typography readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

          {/* Bottom Film Typography Overlay */}
          <div className="relative z-10 text-center space-y-2 mt-auto">
            <p className="text-xs italic tracking-wider text-purple-200 drop-shadow">
              "{tagline}"
            </p>
            <h1
              className={`text-3xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] ${
                fontVibe === 'cyber' ? 'font-mono tracking-widest text-cyan-300' : 'font-display'
              }`}
            >
              {title}
            </h1>
            <div className="pt-2 border-t border-white/20 flex justify-center gap-4 text-[9px] font-mono uppercase tracking-widest text-gray-300">
              <span>{eraName}</span>
              <span>•</span>
              <span>{genre}</span>
              <span>•</span>
              <span>IN CHRONO-VISION</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Controls (Right 5 cols) */}
      <div className="lg:col-span-5 space-y-5 rounded-2xl border border-white/10 bg-surface-100/80 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Type className="h-5 w-5 text-cyan-400" />
          <h3 className="font-display text-base font-bold text-white">Poster Studio Controls</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-gray-300">Film Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-gray-300">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-gray-300">Starring Actor / Character</label>
            <input
              type="text"
              value={leadStar}
              onChange={(e) => setLeadStar(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-gray-300">Director / Studio Credit</label>
            <input
              type="text"
              value={directorCredit}
              onChange={(e) => setDirectorCredit(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-gray-300">Typography Mood</label>
            <div className="mt-1 flex gap-2">
              {(['cinematic', 'cyber', 'gothic'] as const).map((vibe) => (
                <button
                  key={vibe}
                  onClick={() => setFontVibe(vibe)}
                  className={`flex-1 rounded-lg border px-3 py-1.5 uppercase font-mono text-[10px] transition ${
                    fontVibe === vibe
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-glow-cyan hover:opacity-95 transition"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Generating Poster PNG...' : 'Download Poster (High Res)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
