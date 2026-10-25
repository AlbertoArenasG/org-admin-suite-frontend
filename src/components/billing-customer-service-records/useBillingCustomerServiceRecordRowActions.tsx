'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

import type { DataTableRowActions } from '@/components/data-table';
import { useDashboardViewAccess } from '@/components/dashboard-shell';
import type { BillingCustomerServiceRecordRow } from '@/features/billing-customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export function useBillingCustomerServiceRecordRowActions() {
  const router = useRouter();
  const { can } = useDashboardViewAccess();
  const { t } = useTranslationHydrated('billingCustomerServiceRecords');
  const canRead = can('READ');

  return useMemo<DataTableRowActions<BillingCustomerServiceRecordRow>>(
    () => ({
      getActions: (row) =>
        canRead
          ? [
              {
                id: 'view',
                label: t('actions.view'),
                icon: <Eye />,
                isPrimary: true,
                onSelect: () =>
                  router.push(
                    `/dashboard/billing/customer-service-records/${row.customerServiceRecordId}`
                  ),
              },
            ]
          : [],
    }),
    [canRead, router, t]
  );
}
