'use client';

import {
  ChevronsUpDown,
  Globe,
  Layers,
  LogOut,
  Settings,
  Sparkles,
  UserCircle,
  Waves,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/features/auth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { getInitialsFromText } from '@/lib/get-initials';
import { cn } from '@/lib/utils';

type SidebarAccountMenuProps = {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function SidebarAccountMenu({
  user,
  collapsed = false,
  onNavigate,
  className,
}: SidebarAccountMenuProps) {
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
    <div
      className={cn(
        'dashboard-navigation-panel rounded-xl border border-[var(--dashboard-navigation-border)] bg-[var(--dashboard-navigation-panel-surface)] p-1.5 text-sidebar-foreground shadow-[var(--dashboard-navigation-panel-shadow)] backdrop-blur-xl',
        collapsed && 'border-transparent bg-transparent p-0 shadow-none',
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'h-auto w-full justify-start gap-2 px-2 py-1.5 text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground',
              collapsed && 'size-10 justify-center rounded-xl p-0'
            )}
          >
            <AccountAvatar avatarSrc={avatarSrc} name={user.name} initials={initials} />
            {!collapsed ? (
              <span className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold">{user.name}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">{user.email}</span>
              </span>
            ) : null}
            {!collapsed ? <ChevronsUpDown className="size-4 shrink-0" /> : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 rounded-xl" side="right" align="end" sideOffset={8}>
          <DropdownMenuLabel className="flex items-center gap-2 p-2 font-normal">
            <AccountAvatar avatarSrc={avatarSrc} name={user.name} initials={initials} />
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

type AccountAvatarProps = {
  avatarSrc?: string;
  name: string;
  initials: string;
};

function AccountAvatar({ avatarSrc, name, initials }: AccountAvatarProps) {
  return (
    <Avatar className="size-8 shrink-0 rounded-lg border border-white/30 bg-white/90">
      {avatarSrc ? <AvatarImage src={avatarSrc} alt={name} /> : null}
      <AvatarFallback className="rounded-lg text-xs font-semibold text-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
