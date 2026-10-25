import Link from 'next/link';

import type { DataTableColumn } from '@/components/data-table';
import { BadgeCell } from '@/components/data-table/cells';
import type { BillingCustomerServiceRecordRow } from '@/features/billing-customer-service-records';

type Labels = {
  serviceNumber: string;
  customer: string;
  equipment: string;
  serviceType: string;
  billingStatus: string;
  noEquipment: string;
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
          className="font-mono text-muted-foreground hover:text-foreground hover:underline"
        >
          {highlight(row.serviceNumber)}
        </Link>
      ),
      width: { initial: 130, min: 100, max: 190, resizable: true },
      visibility: { hideable: false },
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
      width: { initial: 260, min: 180, max: 420, resizable: true },
    },
    {
      id: 'equipment',
      header: labels.equipment,
      ariaLabel: labels.equipment,
      accessor: (row) =>
        row.assets
          .map((asset) =>
            [asset.name, asset.identifier, asset.brand, asset.model].filter(Boolean).join(' ')
          )
          .join(', '),
      cell: (row, { highlight }) => (
        <span
          className="block truncate"
          title={
            row.assets
              .map((asset) =>
                [asset.name, asset.identifier, asset.brand, asset.model].filter(Boolean).join(' · ')
              )
              .join(', ') || labels.noEquipment
          }
        >
          {row.assets.length
            ? row.assets.map((asset, index) => (
                <span key={asset.assetId}>
                  {index ? ', ' : null}
                  {highlight(asset.name)}
                  {asset.identifier ? (
                    <span className="font-mono text-xs text-muted-foreground">
                      {' '}
                      [{highlight(asset.identifier)}]
                    </span>
                  ) : null}
                </span>
              ))
            : labels.noEquipment}
        </span>
      ),
      textBehavior: 'truncate',
      width: { initial: 300, min: 210, max: 500, resizable: true },
    },
    {
      id: 'serviceType',
      header: labels.serviceType,
      ariaLabel: labels.serviceType,
      accessor: (row) => row.serviceType.name,
      cell: (row, { highlight }) => (
        <span className="block truncate" title={row.serviceType.name}>
          {highlight(row.serviceType.name)}
        </span>
      ),
      textBehavior: 'truncate',
      width: { initial: 220, min: 160, max: 360, resizable: true },
    },
    {
      id: 'billingStatus',
      header: labels.billingStatus,
      ariaLabel: labels.billingStatus,
      accessor: (row) => row.billingStatus.name,
      cell: (row) => <BadgeCell label={row.billingStatus.name} variant="outline" />,
      width: { initial: 170, min: 150, max: 250, resizable: true },
    },
  ];
}
