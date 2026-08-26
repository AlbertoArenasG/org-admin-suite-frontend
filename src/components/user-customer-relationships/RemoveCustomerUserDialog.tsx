'use client';

import { useTranslation } from 'react-i18next';
import type { CustomerRelatedUser } from '@/features/user-customer-relationships';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RemoveCustomerUserDialogProps {
  open: boolean;
  user: CustomerRelatedUser | null;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function RemoveCustomerUserDialog({
  open,
  user,
  loading,
  onOpenChange,
  onConfirm,
}: RemoveCustomerUserDialogProps) {
  const { t } = useTranslation('customers');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('detail.relatedUsers.removeDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('detail.relatedUsers.removeDialog.description', {
              name: user?.fullName || user?.email || '—',
            })}
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {t('detail.relatedUsers.removeDialog.note')}
        </p>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            {t('detail.relatedUsers.actions.cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading
              ? t('detail.relatedUsers.actions.processing')
              : t('detail.relatedUsers.actions.remove')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
