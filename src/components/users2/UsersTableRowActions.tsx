'use client';

import Link from 'next/link';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UsersTableUser } from '@/components/users2/types';
import { canInviteSystemRole, canManageSystemRole } from '@/features/users/roles';
import type { AuthSystemRole } from '@/features/auth/types';

interface UsersTableRowActionsProps {
  user: UsersTableUser;
  currentRole: AuthSystemRole | null;
  currentUserId: string | null;
  canInviteUsers: boolean;
  canUpdateUsers: boolean;
  canDeleteUsers: boolean;
  onDelete: (user: UsersTableUser) => void;
  labels: {
    menu: string;
    view: string;
    edit: string;
    invite: string;
    delete: string;
  };
}

export function UsersTableRowActions({
  user,
  currentRole,
  currentUserId,
  canInviteUsers,
  canUpdateUsers,
  canDeleteUsers,
  onDelete,
  labels,
}: UsersTableRowActionsProps) {
  const isSelf = currentUserId === user.id;
  const canEdit =
    canUpdateUsers && currentRole
      ? canManageSystemRole(currentRole, user.systemRole, {
          allowSelf: isSelf,
          allowUserPeer: true,
        })
      : false;
  const canDelete =
    canDeleteUsers && currentRole
      ? !isSelf &&
        canManageSystemRole(currentRole, user.systemRole, {
          allowUserPeer: true,
        })
      : false;
  const canInvite =
    canInviteUsers && currentRole ? canInviteSystemRole(currentRole, user.systemRole) : false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={labels.menu}
          className="text-muted-foreground hover:text-foreground"
        >
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/users/${user.id}`}>{labels.view}</Link>
        </DropdownMenuItem>
        {canEdit ? (
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/users/${user.id}/edit`}>{labels.edit}</Link>
          </DropdownMenuItem>
        ) : null}
        {canInvite ? (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/users/invite">{labels.invite}</Link>
          </DropdownMenuItem>
        ) : null}
        {canDelete ? (
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              onDelete(user);
            }}
          >
            {labels.delete}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
