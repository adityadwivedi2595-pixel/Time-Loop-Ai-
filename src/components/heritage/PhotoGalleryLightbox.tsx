'use client';

import React, { useState, useEffect } from 'react';
import { MonumentPhoto } from '@/data/indian-monuments';
import { 
  Camera, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Info,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';

interface PhotoGalleryLightboxProps {
  photos: MonumentPhoto[];
  monumentName: string;
}

export function PhotoGalleryLightbox({ photos, monumentName }: PhotoGalleryLightboxProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  const categories = ['All', 'Exterior', 'Interior', 'Aerial', 'Carving', 'Historical'];

  const filteredPhotos = photos.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] || filteredPhotos[0] : null;

  // Keyboard controls for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
        setZoomLevel(1.0);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
        setZoomLevel(1.0);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0));
        setZoomLevel(1.0);
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel((z) => Math.min(3.0, z + 0.25));
      } else if (e.key === '-') {
        setZoomLevel((z) => Math.max(0.5, z - 0.25));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, filteredPhotos.length]);

  return (
    <div className="w-full space-y-4">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-cyan-400" />
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
            Authentic Photographic Archives ({filteredPhotos.length})
          </h3>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-xl bg-black/60 border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setLightboxIndex(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black shadow-glow-cyan'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Authentic Photographs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredPhotos.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => {
              setLightboxIndex(idx);
              setZoomLevel(1.0);
            }}
            className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black/60 hover:border-cyan-400/50 hover:shadow-glow-cyan transition-all duration-300 cursor-pointer flex flex-col"
          >
            {/* Image Container with Hover Zoom */}
            <div className="relative h-52 w-full overflow-hidden bg-zinc-950">
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              />

              {/* Category Pill Overlay */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 border border-white/20 text-[10px] font-mono font-bold text-cyan-300 backdrop-blur-md">
                {photo.category}
              </div>

              {/* Zoom Action Hint */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-black font-extrabold text-xs shadow-lg">
                  <ZoomIn className="h-4 w-4" />
                  <span>Inspect High-Res</span>
                </span>
              </div>
            </div>

            {/* Photo Metadata Footer */}
            <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-display text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {photo.title}
                </h4>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mt-0.5">
                  {photo.caption}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span className="truncate max-w-[160px]">
                  {photo.photographer || 'ASI Historical Archive'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-gray-300">
                  {photo.license || 'Public Domain / CC-BY'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL WITH ZOOM */}
      {activePhoto && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-xs font-mono font-bold text-cyan-300">
                {activePhoto.category} ({lightboxIndex + 1} / {filteredPhotos.length})
              </span>
              <div>
                <h3 className="font-display text-sm sm:text-base font-black text-white">{activePhoto.title}</h3>
                <p className="text-xs text-gray-400 font-mono hidden sm:block">{monumentName}</p>
              </div>
            </div>

            {/* Lightbox Controls: Zoom In, Zoom Out, Reset, Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(3.0, z + 0.25))}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1.0)}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setLightboxIndex(null);
                  setZoomLevel(1.0);
                }}
                className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition cursor-pointer ml-2"
                title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Center Image Canvas with Pan & Zoom */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-3">
            <img
              src={activePhoto.url}
              alt={activePhoto.title}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-h-[75vh] max-w-[90vw] object-contain transition-transform duration-200 select-none shadow-2xl rounded-xl"
            />

            {/* Left / Right Nav Arrows */}
            {filteredPhotos.length > 1 && (
              <>
                <button
                  onClick={() => {
                    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0));
                    setZoomLevel(1.0);
                  }}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/80 border border-white/20 text-white hover:bg-cyan-500 hover:text-black transition cursor-pointer shadow-2xl"
                  title="Previous Photo (Left Arrow)"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => {
                    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
                    setZoomLevel(1.0);
                  }}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/80 border border-white/20 text-white hover:bg-cyan-500 hover:text-black transition cursor-pointer shadow-2xl"
                  title="Next Photo (Right Arrow)"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Caption & Citation Bar */}
          <div className="border-t border-white/10 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs z-10 bg-black/80 p-3 rounded-2xl">
            <p className="text-gray-300 leading-relaxed max-w-2xl">
              {activePhoto.caption}
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
              <span>Source: {activePhoto.photographer || 'Archaeological Survey of India'}</span>
              <span>•</span>
              <span className="text-cyan-300">{activePhoto.license || 'Public Domain / CC-BY 4.0'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
