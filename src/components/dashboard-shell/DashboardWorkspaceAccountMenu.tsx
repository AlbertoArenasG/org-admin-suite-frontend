'use client';

import { AccountMenuContent, type AccountMenuUser } from '@/components/account/AccountMenuContent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppSelector } from '@/hooks/useAppSelector';
import { getInitialsFromText } from '@/lib/get-initials';

const fallbackUser: AccountMenuUser = { name: 'ICSA', email: '' };

/** Compact account control for the global header inside Workspace Canvas. */
export function DashboardWorkspaceAccountMenu() {
  const authUser = useAppSelector((state) => state.auth.user);
  const fullName = [authUser?.name, authUser?.lastname].filter(Boolean).join(' ').trim();
  const user: AccountMenuUser = authUser
    ? { name: fullName || authUser.email, email: authUser.email, avatar: null }
    : fallbackUser;
  const initials = getInitialsFromText(user.name || user.email, '??');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-label="Cuenta"
        className="dashboard-workspace-chrome-control inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--workspace-chrome-foreground)] outline-none hover:bg-[var(--workspace-chrome-control-hover)] hover:text-[var(--workspace-chrome-foreground)]"
      >
        <Avatar className="size-7 border border-[var(--workspace-chrome-avatar-border)]">
          {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
          <AvatarFallback className="bg-[var(--workspace-chrome-avatar-surface)] text-[10px] font-semibold text-[var(--workspace-chrome-foreground)]">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-xl" side="bottom" align="end" sideOffset={8}>
        <AccountMenuContent user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
