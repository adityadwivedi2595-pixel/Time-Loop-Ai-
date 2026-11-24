'use client';

import React from 'react';
import Link from 'next/link';
import { Monument3DExplorer } from '@/components/virtual/Monument3DExplorer';
import { ArrowLeft, Box } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function Experience4DPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-cyan-300 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Command Center</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="cyan">3D Virtual Matrix</Badge>
          <Badge variant="purple">60 FPS Hardware WebGL</Badge>
        </div>
      </div>

      <Monument3DExplorer />
    </div>
  );
}
