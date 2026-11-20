import React from 'react';
import { cn } from '@/lib/utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: 'purple' | 'cyan' | 'none';
  interactive?: boolean;
}

export function GlassCard({ children, className, glow = 'none', interactive = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-white/10 bg-surface-100/60 p-6 backdrop-blur-xl transition-all duration-300 shadow-glow-card',
        glow === 'purple' && 'border-purple-500/30 hover:border-purple-500/60 hover:shadow-glow-purple',
        glow === 'cyan' && 'border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-glow-cyan',
        interactive && 'hover:-translate-y-1 hover:bg-surface-100/80 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
