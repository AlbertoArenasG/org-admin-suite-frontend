'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
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
  const { setTheme } = useTheme();
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
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('changeTheme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>{t('themeLight')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>{t('themeDark')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>{t('themeSystem')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
