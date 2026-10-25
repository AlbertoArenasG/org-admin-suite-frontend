import Link from 'next/link';

import type { DataTableColumn } from '@/components/data-table';
import { BadgeCell } from '@/components/data-table/cells';
import { CustomerServiceRecordServiceAndAssetsCell } from '@/components/customer-service-records/CustomerServiceRecordServiceAndAssetsCell';
import type { BillingCustomerServiceRecordRow } from '@/features/billing-customer-service-records';

type Labels = {
  serviceNumber: string;
  customer: string;
  serviceAndAssets: string;
  billingStatus: string;
};

export function createBillingCustomerServiceRecordsColumns(
  labels: Labels
): DataTableColumn<BillingCustomerServiceRecordRow>[] {
  return [
    {
      id: 'serviceNumber',
      header: labels.serviceNumber,
      ariaLabel: labels.serviceNumber,
      accessor: (row) => row.serviceNumber,
      cell: (row, { highlight }) => (
        <Link
          href={`/dashboard/billing/customer-service-records/${row.customerServiceRecordId}`}
          className="font-mono font-normal text-muted-foreground hover:text-foreground hover:underline"
        >
          {highlight(row.serviceNumber)}
        </Link>
      ),
      width: { initial: 80, min: 80, max: 160, resizable: true },
      visibility: { hideable: false },
    },
    {
      id: 'serviceAndAssets',
      header: labels.serviceAndAssets,
      ariaLabel: labels.serviceAndAssets,
      accessor: (row) =>
        [row.serviceType.name, ...row.assets.map((asset) => `${asset.name} ${asset.identifier}`)]
          .filter(Boolean)
          .join(' '),
      cell: (row, { highlight }) => (
        <CustomerServiceRecordServiceAndAssetsCell row={row} highlight={highlight} />
      ),
      textBehavior: 'wrap',
      width: { initial: 360, min: 260, max: 580, resizable: true },
    },
    {
      id: 'billingStatus',
      header: labels.billingStatus,
      ariaLabel: labels.billingStatus,
      accessor: (row) => row.billingStatus.name,
      cell: (row) => <BadgeCell label={row.billingStatus.name} variant="outline" />,
      width: { initial: 168, min: 152, max: 260, resizable: true },
    },
    {
      id: 'customer',
      header: labels.customer,
      ariaLabel: labels.customer,
      accessor: (row) => row.customer.name,
      cell: (row, { highlight }) => (
        <span className="block truncate" title={row.customer.name}>
          {highlight(row.customer.name)}
        </span>
      ),
      textBehavior: 'truncate',
      width: { initial: 280, min: 180, max: 420, resizable: true },
    },
  ];
}
