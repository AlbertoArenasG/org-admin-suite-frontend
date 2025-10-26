'use client';

import CircularProgress from '@mui/material/CircularProgress';
import clsx from 'clsx';

interface FullScreenLoaderProps {
  text?: string;
  className?: string;
}

export function FullScreenLoader({ text, className }: FullScreenLoaderProps) {
  return (
    <div
      className={clsx(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <CircularProgress size={48} sx={{ color: 'var(--primary)' }} />
      {text ? <p className="text-sm text-muted-foreground">{text}</p> : null}
    </div>
  );
}
