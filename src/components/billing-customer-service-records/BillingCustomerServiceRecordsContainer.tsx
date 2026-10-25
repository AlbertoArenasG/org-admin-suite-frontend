'use client';

import { DashboardContentReveal } from '@/components/dashboard-shell';
import { BillingCustomerServiceRecordsTable } from './BillingCustomerServiceRecordsTable';
import { useBillingCustomerServiceRecordRowActions } from './useBillingCustomerServiceRecordRowActions';
import { useBillingCustomerServiceRecordsListController } from './useBillingCustomerServiceRecordsListController';

export function BillingCustomerServiceRecordsContainer() {
  const controller = useBillingCustomerServiceRecordsListController();
  const rowActions = useBillingCustomerServiceRecordRowActions();

  return (
    <DashboardContentReveal>
      <BillingCustomerServiceRecordsTable controller={controller} rowActions={rowActions} />
    </DashboardContentReveal>
  );
}
