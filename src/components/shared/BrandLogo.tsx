'use client';

import Image from 'next/image';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export interface BrandLogoProps extends ComponentPropsWithoutRef<'a'> {
  name?: string;
  size?: 'md' | 'lg';
  imageSrc?: string;
}

const imageSizing: Record<
  NonNullable<BrandLogoProps['size']>,
  { container: string; image: string; size: number }
> = {
  md: { container: 'h-12 w-12', image: 'h-10 w-10', size: 48 },
  lg: { container: 'h-16 w-16', image: 'h-14 w-14', size: 64 },
};

export function BrandLogo({
  className,
  name = 'ICSACV',
  size = 'md',
  imageSrc = '/logo.jpeg',
  ...props
}: BrandLogoProps) {
  const sizing = imageSizing[size];

  return (
    <a {...props} className={cn('flex items-center gap-3 font-medium text-foreground', className)}>
      <span
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-xl',
          sizing.container
        )}
      >
        <Image
          src={imageSrc}
          alt={name}
          width={sizing.size}
          height={sizing.size}
          priority
          className={cn('object-contain', sizing.image)}
        />
      </span>
      <span className="text-lg font-semibold tracking-wide">{name}</span>
    </a>
  );
}
