'use client';

import { ChevronsUpDown, LogOut, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SelectLang from '@/components/shared/LangToggle';
import { ModeToggle } from '@/components/shared/ModeToggle';
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
  const { t } = useTranslation(['myProfile', 'auth']);
  const initials = getInitialsFromText(user.name || user.email, '??');
  const avatarSrc = user.avatar ?? undefined;

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-black/10 p-1.5 text-sidebar-foreground',
        collapsed && 'border-transparent bg-transparent p-0',
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
      {!collapsed ? (
        <div className="mt-1 flex items-center gap-1 border-t border-white/10 pt-1">
          <ModeToggle
            buttonVariant="ghost"
            buttonSize="icon"
            buttonClassName="size-8 text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground"
          />
          <SelectLang
            buttonVariant="ghost"
            buttonSize="icon"
            buttonClassName="size-8 text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground"
          />
        </div>
      ) : null}
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
