'use client';

import { ChevronsUpDown } from 'lucide-react';

import { AccountMenuContent } from '@/components/account/AccountMenuContent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const initials = getInitialsFromText(user.name || user.email, '??');
  const avatarSrc = user.avatar ?? undefined;

  return (
    <div
      className={cn(
        'dashboard-navigation-panel rounded-xl border border-[var(--dashboard-navigation-panel-border)] bg-[var(--dashboard-navigation-panel-surface)] p-1.5 text-sidebar-foreground shadow-[var(--dashboard-navigation-panel-shadow)] backdrop-[var(--dashboard-navigation-panel-backdrop)]',
        collapsed && 'border-transparent bg-transparent p-0 shadow-none',
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'h-auto w-full justify-start gap-2 px-2 py-1.5 text-sidebar-foreground hover:bg-[var(--dashboard-navigation-control-hover-surface)] hover:text-sidebar-foreground',
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
          <AccountMenuContent
            user={user}
            onNavigate={onNavigate}
            avatarClassName="border-[var(--dashboard-navigation-avatar-border)] bg-[var(--dashboard-navigation-avatar-surface)]"
            avatarFallbackClassName="text-[var(--dashboard-navigation-avatar-foreground)]"
          />
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
    <Avatar className="size-8 shrink-0 rounded-lg border border-[var(--dashboard-navigation-avatar-border)] bg-[var(--dashboard-navigation-avatar-surface)]">
      {avatarSrc ? <AvatarImage src={avatarSrc} alt={name} /> : null}
      <AvatarFallback className="rounded-lg text-xs font-semibold text-[var(--dashboard-navigation-avatar-foreground)]">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
