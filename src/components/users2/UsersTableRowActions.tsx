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
import { canInviteRole, canManageRole } from '@/features/users/roles';
import type { UserRole } from '@/features/users/roles';

interface UsersTableRowActionsProps {
  user: UsersTableUser;
  currentRole: UserRole | null;
  currentUserId: string | null;
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
  onDelete,
  labels,
}: UsersTableRowActionsProps) {
  const isSelf = currentUserId === user.id;
  const canEdit = currentRole
    ? canManageRole(currentRole, user.roleId, { allowSameLevel: isSelf })
    : false;
  const canDelete = currentRole ? !isSelf && canManageRole(currentRole, user.roleId) : false;
  const canInvite = currentRole ? canInviteRole(currentRole, user.roleId) : false;

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
