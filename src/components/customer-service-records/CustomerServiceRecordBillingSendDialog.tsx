'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { showToast } from '@/components/toast';
import {
  submitCustomerServiceRecordToBilling,
  type CustomerServiceRecordBillingMutationError,
} from '@/features/customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type Props = {
  open: boolean;
  record: { id: string; serviceNumber: string } | null;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
};

export function CustomerServiceRecordBillingSendDialog({
  open,
  record,
  onOpenChange,
  onRefresh,
}: Props) {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (pending) return;
    setError(null);
    onOpenChange(false);
  };

  const confirm = async () => {
    if (!record || pending) return;
    setPending(true);
    setError(null);
    try {
      const result = await dispatch(
        submitCustomerServiceRecordToBilling({ recordId: record.id })
      ).unwrap();
      showToast({
        duration: 4000,
        title: result.message ?? t('billing.send.success'),
        type: 'success',
      });
      onOpenChange(false);
      onRefresh();
    } catch (reason) {
      const failure = reason as CustomerServiceRecordBillingMutationError | undefined;
      setError(
        failure?.status === 409
          ? t('billing.send.conflict')
          : failure?.status === 502
            ? t('billing.send.mailFailure')
            : failure?.status === null || !failure
              ? t('billing.send.unknownResult')
              : failure.message || t('billing.send.error')
      );
      if (
        failure?.status === 502 ||
        failure?.status === 409 ||
        failure?.status === null ||
        !failure
      ) {
        onRefresh();
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) close();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('billing.send.title')}</DialogTitle>
          <DialogDescription>
            {t('billing.send.description', { serviceNumber: record?.serviceNumber ?? '' })}
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}
        <DialogFooter className="mt-6 gap-2 sm:space-x-0">
          <Button type="button" variant="outline" disabled={pending} onClick={close}>
            {t('billing.send.cancel')}
          </Button>
          <Button
            type="button"
            loading={pending}
            loadingLabel={t('billing.send.loading')}
            onClick={() => void confirm()}
          >
            {t('billing.send.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
