'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { CustomerAvailableUser } from '@/features/user-customer-relationships';
import { Button } from '@/components/ui/button';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CustomerUserLookupDialogProps {
  open: boolean;
  users: CustomerAvailableUser[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: string) => void;
}

export function CustomerUserLookupDialog({
  open,
  users,
  loading,
  error,
  submitting,
  onOpenChange,
  onSubmit,
}: CustomerUserLookupDialogProps) {
  const { t } = useTranslation('customers');
  const [selected, setSelected] = useState<CustomerAvailableUser | null>(null);
  const options: ComboboxOption[] = users.map((user) => ({
    value: user.id,
    label: user.fullName || user.email,
    description: user.email,
  }));

  useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setSelected(null);
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('detail.relatedUsers.addDialog.title')}</DialogTitle>
          <DialogDescription>{t('detail.relatedUsers.addDialog.description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm font-medium">{t('detail.relatedUsers.addDialog.field')}</p>
          <Combobox
            options={options}
            value={selected?.id ?? null}
            onValueChange={(userId) =>
              setSelected(users.find((user) => user.id === userId) ?? null)
            }
            loading={loading}
            placeholder={t('detail.relatedUsers.addDialog.placeholder')}
            searchPlaceholder={t('detail.relatedUsers.addDialog.placeholder')}
            emptyMessage={t('detail.relatedUsers.empty')}
            portalled={false}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter className="mt-4 gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            {t('detail.relatedUsers.actions.cancel')}
          </Button>
          <Button
            onClick={() => selected && onSubmit(selected.id)}
            disabled={!selected || submitting}
          >
            {submitting
              ? t('detail.relatedUsers.actions.processing')
              : t('detail.relatedUsers.actions.add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
