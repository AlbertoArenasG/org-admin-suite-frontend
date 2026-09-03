'use client';

import * as React from 'react';
import { Layers, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModeToggleProps {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  buttonSize?: React.ComponentProps<typeof Button>['size'];
  buttonClassName?: string;
}

export function ModeToggle({
  buttonVariant = 'outline',
  buttonSize = 'icon',
  buttonClassName,
}: ModeToggleProps) {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation('common');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          aria-label={t('changeTheme')}
          className={buttonClassName}
        >
          {theme !== 'classic' ? (
            <Sparkles className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Layers className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">{t('changeTheme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('classic')}>{t('themeClassic')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('ambient')}>
          {t('themeAmbientClassic')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('ambient-deep')}>
          {t('themeAmbientDeep')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
