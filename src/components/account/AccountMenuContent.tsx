'use client';

import { Globe, Layers, LogOut, Moon, Settings, Sparkles, UserCircle, Waves } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/features/auth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { getInitialsFromText } from '@/lib/get-initials';
import { cn } from '@/lib/utils';

export type AccountMenuUser = {
  name: string;
  email: string;
  avatar?: string | null;
};

interface AccountMenuContentProps {
  user: AccountMenuUser;
  onNavigate?: () => void;
  avatarClassName?: string;
  avatarFallbackClassName?: string;
}

/** Shared account actions for navigation and workspace toolbar triggers. */
export function AccountMenuContent({
  user,
  onNavigate,
  avatarClassName,
  avatarFallbackClassName,
}: AccountMenuContentProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { t, i18n } = useTranslation(['myProfile', 'auth', 'common']);
  const initials = getInitialsFromText(user.name || user.email, '??');
  const avatarSrc = user.avatar ?? undefined;

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <>
      <DropdownMenuLabel className="flex items-center gap-2 p-2 font-normal">
        <Avatar
          className={cn(
            'size-8 shrink-0 rounded-lg border border-border bg-muted',
            avatarClassName
          )}
        >
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={user.name} /> : null}
          <AvatarFallback
            className={cn(
              'rounded-lg text-xs font-semibold text-foreground',
              avatarFallbackClassName
            )}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="grid min-w-0 leading-tight">
          <span className="truncate text-sm font-semibold">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
        </span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onSelect={() => {
          router.push('/dashboard/me');
          onNavigate?.();
        }}
      >
        <UserCircle />
        {t('myProfile:actions.view')}
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Settings />
          {t('common:settings')}
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-52">
          <DropdownMenuLabel>{t('common:theme')}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme ?? 'classic'}
            onValueChange={(value) => setTheme(value)}
          >
            <DropdownMenuRadioItem value="classic">
              <Layers />
              {t('common:themeClassic')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ambient">
              <Sparkles />
              {t('common:themeAmbientClassic')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ambient-deep">
              <Waves />
              {t('common:themeAmbientDeep')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="nocturne">
              <Moon />
              {t('common:themeNocturne')}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t('common:language')}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={i18n.language.startsWith('en') ? 'en' : 'es'}
            onValueChange={(language) => void i18n.changeLanguage(language)}
          >
            <DropdownMenuRadioItem value="es">
              <Globe />
              {t('common:spanish')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="en">
              <Globe />
              {t('common:english')}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant="destructive"
        onSelect={() => {
          handleLogout();
          onNavigate?.();
        }}
      >
        <LogOut />
        {t('auth:logout')}
      </DropdownMenuItem>
    </>
  );
}
