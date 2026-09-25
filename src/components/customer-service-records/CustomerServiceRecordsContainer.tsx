'use client';

import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

import { DashboardContentReveal } from '@/components/dashboard-shell';
import { useDashboardViewAccess } from '@/components/dashboard-shell';
import { Button } from '@/components/ui/button';
import { fetchCustomerRelatedUserOptions } from '@/features/user-customer-relationships/userCustomerRelationshipsThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { CustomerServiceRecordCreateDialog } from './CustomerServiceRecordCreateDialog';
import { CustomerServiceRecordsTable } from './CustomerServiceRecordsTable';
import { useCustomerServiceRecordRowActions } from './useCustomerServiceRecordRowActions';
import { useCustomerServiceRecordsListController } from './useCustomerServiceRecordsListController';

export function CustomerServiceRecordsContainer() {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const { can } = useDashboardViewAccess();
  const dispatch = useAppDispatch();
  const controller = useCustomerServiceRecordsListController();
  const relatedUserOptions = useAppSelector(
    (state) => state.userCustomerRelationships.relatedOptions
  );
  const [createOpen, setCreateOpen] = useState(false);
  const { rowActions, deletionDialog } = useCustomerServiceRecordRowActions({
    onDeleted: controller.refetch,
  });
  const canCreate = can('CREATE');

  const loadCustomerUsers = useCallback(
    (customerId: string | null) => {
      if (!customerId) return;
      void dispatch(fetchCustomerRelatedUserOptions({ customerId }));
    },
    [dispatch]
  );

  const customerUsers = relatedUserOptions.users.map((user) => ({
    value: user.id,
    label: user.fullName,
  }));

  return (
    <DashboardContentReveal>
      <CustomerServiceRecordsTable
        controller={controller}
        rowActions={rowActions}
        primaryActions={
          canCreate ? (
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <Plus aria-hidden="true" />
              {t('actions.create')}
            </Button>
          ) : undefined
        }
      />
      {deletionDialog}
      {canCreate ? (
        <CustomerServiceRecordCreateDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          serviceTypes={controller.options.serviceTypes}
          customers={controller.customerOptions.items.map((item) => ({
            value: item.id,
            label: item.companyName,
          }))}
          customerUsers={customerUsers}
          customerUsersLoading={relatedUserOptions.status === 'loading'}
          onCustomerChange={loadCustomerUsers}
        />
      ) : null}
    </DashboardContentReveal>
  );
}
