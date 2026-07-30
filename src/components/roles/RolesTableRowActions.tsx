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
import type { RolesTableRow } from '@/components/roles/types';

interface RolesTableRowActionsProps {
  role: RolesTableRow;
  canUpdate: boolean;
  canDelete: boolean;
  onChangeStatus: (role: RolesTableRow) => void;
  onDelete: (role: RolesTableRow) => void;
  labels: {
    menu: string;
    view: string;
    edit: string;
    activate: string;
    deactivate: string;
    delete: string;
  };
}

export function RolesTableRowActions({
  role,
  canUpdate,
  canDelete,
  onChangeStatus,
  onDelete,
  labels,
}: RolesTableRowActionsProps) {
  const canMutate = !role.isImmutable && !role.isDefault;
  const statusActionLabel = role.statusId === 'ACTIVE' ? labels.deactivate : labels.activate;

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
          <Link href={`/dashboard/roles/${role.roleId}`}>{labels.view}</Link>
        </DropdownMenuItem>
        {canUpdate ? (
          <DropdownMenuItem asChild disabled={!canMutate}>
            <Link
              href={canMutate ? `/dashboard/roles/${role.roleId}/edit` : '#'}
              aria-disabled={!canMutate}
              onClick={(event) => {
                if (!canMutate) {
                  event.preventDefault();
                }
              }}
            >
              {labels.edit}
            </Link>
          </DropdownMenuItem>
        ) : null}
        {canUpdate ? (
          <DropdownMenuItem
            disabled={!canMutate}
            onSelect={(event) => {
              if (!canMutate) {
                event.preventDefault();
                return;
              }
              event.preventDefault();
              onChangeStatus(role);
            }}
          >
            {statusActionLabel}
          </DropdownMenuItem>
        ) : null}
        {canDelete ? (
          <DropdownMenuItem
            variant="destructive"
            disabled={!canMutate}
            onSelect={(event) => {
              if (!canMutate) {
                event.preventDefault();
                return;
              }
              event.preventDefault();
              onDelete(role);
            }}
          >
            {labels.delete}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
