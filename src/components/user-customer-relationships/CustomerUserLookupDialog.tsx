'use client';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { CustomerAvailableUser } from '@/features/user-customer-relationships';
import { Button } from '@/components/ui/button';
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
        <Autocomplete
          options={users}
          value={selected}
          loading={loading}
          onChange={(_, value) => setSelected(value)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(user) => user.fullName || user.email}
          renderOption={(props, user) => (
            <li {...props} key={user.id}>
              <div className="flex flex-col">
                <span>{user.fullName || user.email}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('detail.relatedUsers.addDialog.field')}
              placeholder={t('detail.relatedUsers.addDialog.placeholder')}
              error={Boolean(error)}
              helperText={error}
            />
          )}
        />
        <DialogFooter className="gap-2">
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
