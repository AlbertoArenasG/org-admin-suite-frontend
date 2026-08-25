'use client';

import { AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { UserRegistrationInvitationsTableRow } from './types';

export type UserRegistrationInvitationAction = 'resend' | 'revoke';

interface UserRegistrationInvitationActionDialogProps {
  action: UserRegistrationInvitationAction | null;
  invitation: UserRegistrationInvitationsTableRow | null;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  labels: {
    resend: {
      title: string;
      description: (email: string) => string;
      confirm: string;
    };
    revoke: {
      title: string;
      description: (email: string) => string;
      warning: string;
      confirm: string;
    };
    cancel: string;
  };
}

export function UserRegistrationInvitationActionDialog({
  action,
  invitation,
  isLoading,
  onOpenChange,
  onConfirm,
  labels,
}: UserRegistrationInvitationActionDialogProps) {
  const isRevoke = action === 'revoke';
  const open = Boolean(action && invitation);
  const content = isRevoke ? labels.revoke : labels.resend;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isLoading) {
          onOpenChange(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description(invitation?.email ?? '')}</DialogDescription>
        </DialogHeader>
        {isRevoke ? (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>{labels.revoke.warning}</AlertTitle>
            <AlertDescription>{invitation?.email ?? '—'}</AlertDescription>
          </Alert>
        ) : null}
        <DialogFooter className="gap-2 sm:space-x-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {labels.cancel}
          </Button>
          <Button
            type="button"
            variant={isRevoke ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {content.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
