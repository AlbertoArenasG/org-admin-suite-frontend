'use client';

import { DashboardContentReveal } from '@/components/dashboard-shell';
import { CustomerServiceRecordsTable } from './CustomerServiceRecordsTable';
import { useCustomerServiceRecordRowActions } from './useCustomerServiceRecordRowActions';
import { useCustomerServiceRecordsListController } from './useCustomerServiceRecordsListController';

export function CustomerServiceRecordsContainer() {
  const controller = useCustomerServiceRecordsListController();
  const { rowActions, deletionDialog } = useCustomerServiceRecordRowActions({
    onDeleted: controller.refetch,
  });

  return (
    <DashboardContentReveal>
      <CustomerServiceRecordsTable controller={controller} rowActions={rowActions} />
      {deletionDialog}
    </DashboardContentReveal>
  );
}
