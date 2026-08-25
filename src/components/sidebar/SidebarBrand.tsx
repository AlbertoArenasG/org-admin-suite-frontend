'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type SidebarBrandProps = {
  collapsed: boolean;
  logoAlt: string;
  onToggle: () => void;
  className?: string;
};

export function SidebarBrand({ collapsed, logoAlt, onToggle, className }: SidebarBrandProps) {
  const toggleLabel = collapsed ? 'Expandir navegación' : 'Contraer navegación';

  return (
    <div
      className={cn(
        'group/brand flex min-h-16 items-center gap-3 rounded-2xl bg-white/10 p-3 text-sidebar-foreground',
        collapsed && 'justify-center rounded-full bg-transparent p-0',
        className
      )}
    >
      <Link
        href="/dashboard"
        aria-label="Panel"
        className="flex shrink-0 rounded-xl outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-white p-1">
          <Image
            src="/logo.jpeg"
            alt={logoAlt}
            width={40}
            height={40}
            className="size-full rounded-lg object-contain"
            priority
          />
        </span>
      </Link>
      {!collapsed ? (
        <span className="min-w-0 flex-1 truncate text-base font-semibold">ICSA</span>
      ) : null}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={toggleLabel}
            onClick={onToggle}
            className={cn(
              'size-8 shrink-0 text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground',
              collapsed &&
                'absolute opacity-0 transition-opacity group-hover/brand:opacity-100 group-focus-within/brand:opacity-100'
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{toggleLabel}</TooltipContent>
      </Tooltip>
    </div>
  );
}
