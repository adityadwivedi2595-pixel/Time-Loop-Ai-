import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'purple' | 'cyan' | 'emerald' | 'amber' | 'red' | 'outline';
}

export function Badge({ children, className, variant = 'purple', ...props }: BadgeProps) {
  const variantStyles = {
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    red: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    outline: 'bg-white/5 text-gray-300 border border-white/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
