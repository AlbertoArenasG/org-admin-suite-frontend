'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarRailBrandProps {
  collapsed: boolean;
  logoAlt: string;
  onExpand: () => void;
}

export function SidebarRailBrand({ collapsed, logoAlt, onExpand }: SidebarRailBrandProps) {
  const { t } = useTranslation('nav');

  return (
    <div className="group/rail-brand relative flex size-11 items-center justify-center rounded-xl">
      <Link
        href="/dashboard"
        aria-label={t('dashboard')}
        className="flex rounded-xl outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--dashboard-navigation-logo-surface)] p-1">
          <Image
            src="/logo.jpeg"
            alt={logoAlt}
            width={36}
            height={36}
            className="size-full rounded-lg object-contain"
            priority
          />
        </span>
      </Link>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('expandNavigation')}
              onClick={onExpand}
              className="absolute inset-0 size-11 rounded-xl bg-[var(--sidebar-primary)] opacity-0 transition-[opacity,background-color] group-hover/rail-brand:opacity-100 focus-visible:opacity-100 hover:bg-[var(--secondary-500)]"
            >
              <PanelLeftOpen className="size-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{t('expandNavigation')}</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
}
