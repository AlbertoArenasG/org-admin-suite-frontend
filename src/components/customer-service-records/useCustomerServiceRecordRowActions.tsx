'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { type DataTableRowAction, type DataTableRowActions } from '@/components/data-table';
import { useDashboardViewAccess } from '@/components/dashboard-shell';
import { DestructiveConfirmationDialog } from '@/components/shared/DestructiveConfirmationDialog';
import { showToast } from '@/components/toast';
import {
  deleteCustomerServiceRecord,
  type CustomerServiceRecordListItem,
} from '@/features/customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type UseCustomerServiceRecordRowActionsOptions = {
  onDeleted: () => void;
};

export function useCustomerServiceRecordRowActions({
  onDeleted,
}: UseCustomerServiceRecordRowActionsOptions) {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const dispatch = useAppDispatch();
  const { can } = useDashboardViewAccess();
  const router = useRouter();
  const mutations = useAppSelector((state) => state.customerServiceRecords.mutations);
  const [recordPendingDeletion, setRecordPendingDeletion] =
    useState<CustomerServiceRecordListItem | null>(null);
  const canUpdate = can('UPDATE');
  const canDelete = can('DELETE');

  useEffect(() => {
    if (
      !recordPendingDeletion ||
      mutations.currentRecordId !== recordPendingDeletion.customerServiceRecordId
    ) {
      return;
    }

    if (mutations.deleteStatus === 'succeeded') {
      setRecordPendingDeletion(null);
      showToast({
        duration: 4000,
        title: mutations.message ?? t('delete.success'),
        type: 'success',
      });
      onDeleted();
      return;
    }

    if (mutations.deleteStatus === 'failed') {
      showToast({
        duration: 5000,
        title: mutations.error ?? t('delete.error'),
        type: 'error',
      });
    }
  }, [mutations, onDeleted, recordPendingDeletion, t]);

  const rowActions = useMemo<DataTableRowActions<CustomerServiceRecordListItem>>(
    () => ({
      getActions: (row) => {
        const recordUrl = `/dashboard/customer-service-records/${row.customerServiceRecordId}`;
        const actions: DataTableRowAction<CustomerServiceRecordListItem>[] = [
          {
            id: 'view',
            label: t('actions.view'),
            icon: <Eye />,
            isPrimary: true,
            onSelect: () => router.push(recordUrl),
          },
        ];

        if (canUpdate) {
          actions.push({
            id: 'edit',
            label: t('actions.edit'),
            icon: <Pencil />,
            onSelect: () => router.push(`${recordUrl}/edit`),
          });
        }

        if (canDelete) {
          actions.push({
            id: 'delete',
            label: t('actions.delete'),
            icon: <Trash2 />,
            variant: 'destructive',
            onSelect: () => setRecordPendingDeletion(row),
          });
        }

        return actions;
      },
    }),
    [canDelete, canUpdate, router, t]
  );

  return {
    rowActions,
    deletionDialog: (
      <DestructiveConfirmationDialog
        open={Boolean(recordPendingDeletion)}
        onOpenChange={(open) => {
          if (!open) setRecordPendingDeletion(null);
        }}
        title={t('delete.title')}
        description={t('delete.description')}
        subject={recordPendingDeletion?.serviceNumber}
        cancelLabel={t('delete.cancel')}
        confirmLabel={t('delete.confirm')}
        isPending={
          mutations.deleteStatus === 'loading' &&
          mutations.currentRecordId === recordPendingDeletion?.customerServiceRecordId
        }
        onConfirm={() => {
          if (!recordPendingDeletion) return;
          void dispatch(
            deleteCustomerServiceRecord({
              recordId: recordPendingDeletion.customerServiceRecordId,
            })
          );
        }}
      />
    ),
  };
}
