'use client';

import { EllipsisVertical, Eye, Mail, ShieldX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserRegistrationInvitationsTableRow } from './types';

interface UserRegistrationInvitationTableRowActionsProps {
  invitation: UserRegistrationInvitationsTableRow;
  canResend: boolean;
  canRevoke: boolean;
  onView: (invitation: UserRegistrationInvitationsTableRow) => void;
  isLoading: boolean;
  onResend: (invitation: UserRegistrationInvitationsTableRow) => void;
  onRevoke: (invitation: UserRegistrationInvitationsTableRow) => void;
  labels: {
    menu: string;
    resend: string;
    revoke: string;
    view: string;
  };
}

export function UserRegistrationInvitationTableRowActions({
  invitation,
  canResend,
  canRevoke,
  onView,
  isLoading,
  onResend,
  onRevoke,
  labels,
}: UserRegistrationInvitationTableRowActionsProps) {
  const canAct = invitation.status === 'PENDING' && (canResend || canRevoke);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={labels.menu}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground"
        >
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[13rem]">
        <DropdownMenuItem onSelect={() => onView(invitation)}>
          <Eye className="size-4" />
          {labels.view}
        </DropdownMenuItem>
        {canResend ? (
          <DropdownMenuItem disabled={isLoading} onSelect={() => onResend(invitation)}>
            <Mail className="size-4" />
            {labels.resend}
          </DropdownMenuItem>
        ) : null}
        {canRevoke ? (
          <DropdownMenuItem
            variant="destructive"
            disabled={isLoading}
            onSelect={() => onRevoke(invitation)}
          >
            <ShieldX className="size-4" />
            {labels.revoke}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
