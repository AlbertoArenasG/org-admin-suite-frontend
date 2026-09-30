'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2 } from 'lucide-react';

import { type DataTableRowAction, type DataTableRowActions } from '@/components/data-table';
import { useDashboardViewAccess } from '@/components/dashboard-shell';
import { DestructiveConfirmationDialog } from '@/components/shared/DestructiveConfirmationDialog';
import { showToast } from '@/components/toast';
import {
  deleteServicePackageRecord,
  resetServicePackageRecordDeleteMutation,
  type ServicePackageRecordListItem,
} from '@/features/servicePackagesRecords';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type UseServicePackageRecordRowActionsOptions = {
  onDeleted: () => void;
};

export function useServicePackageRecordRowActions({
  onDeleted,
}: UseServicePackageRecordRowActionsOptions) {
  const { t } = useTranslationHydrated('servicePackagesRecords');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { can } = useDashboardViewAccess();
  const mutations = useAppSelector((state) => state.servicePackagesRecords.mutations);
  const [recordPendingDeletion, setRecordPendingDeletion] =
    useState<ServicePackageRecordListItem | null>(null);
  const canRead = can('READ');
  const canDelete = can('DELETE');

  useEffect(() => {
    if (!recordPendingDeletion || mutations.currentRecordId !== recordPendingDeletion.id) {
      return;
    }

    if (mutations.deleteStatus === 'succeeded') {
      setRecordPendingDeletion(null);
      showToast({
        duration: 4000,
        title: mutations.message ?? t('delete.success'),
        type: 'success',
      });
      dispatch(resetServicePackageRecordDeleteMutation());
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
  }, [dispatch, mutations, onDeleted, recordPendingDeletion, t]);

  const rowActions = useMemo<DataTableRowActions<ServicePackageRecordListItem>>(
    () => ({
      getActions: (row) => {
        if (!canRead) return [];

        const recordUrl = `/dashboard/service-packages-records/${row.id}`;
        const actions: DataTableRowAction<ServicePackageRecordListItem>[] = [
          {
            id: 'view',
            label: t('actions.view'),
            icon: <Eye />,
            isPrimary: true,
            onSelect: () => router.push(recordUrl),
          },
        ];

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
    [canDelete, canRead, router, t]
  );

  return {
    rowActions,
    deletionDialog: (
      <DestructiveConfirmationDialog
        open={Boolean(recordPendingDeletion)}
        onOpenChange={(open) => {
          if (!open) {
            setRecordPendingDeletion(null);
            dispatch(resetServicePackageRecordDeleteMutation());
          }
        }}
        title={t('delete.title')}
        description={t('delete.description')}
        subject={recordPendingDeletion?.serviceOrder || t('labels.empty')}
        cancelLabel={t('delete.cancel')}
        confirmLabel={t('delete.confirm')}
        isPending={
          mutations.deleteStatus === 'loading' &&
          mutations.currentRecordId === recordPendingDeletion?.id
        }
        onConfirm={() => {
          if (!recordPendingDeletion) return;
          void dispatch(deleteServicePackageRecord({ recordId: recordPendingDeletion.id }));
        }}
      />
    ),
  };
}
