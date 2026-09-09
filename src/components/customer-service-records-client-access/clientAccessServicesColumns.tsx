import type { DataTableColumn } from '@/components/data-table';
import { BadgeCell, DateWithRelativeTimeCell } from '@/components/data-table/cells';
import type { ClientAccessCustomerServiceRecord } from '@/features/customer-service-records-client-access';

type ClientAccessServicesLabels = {
  serviceNumber: string;
  serviceAndAssets: string;
  equipmentDetails: string;
  customer: string;
  operationalStatus: string;
  customerCommitment: string;
  receivedAt: string;
  deliveryAt: string;
  noDate: string;
  noStatus: string;
  estimated: string;
  delivered: string;
};

function formatAssets(row: ClientAccessCustomerServiceRecord) {
  return row.assets
    .map((asset) =>
      [asset.name, asset.identifier ? `(${asset.identifier})` : ''].filter(Boolean).join(' ')
    )
    .join(', ');
}

function formatEquipmentDetails(row: ClientAccessCustomerServiceRecord) {
  const brandAndModel = row.assets
    .map((asset) => [asset.brand, asset.model].filter(Boolean).join(' · '))
    .filter(Boolean)
    .join(', ');
  const serialNumbers = row.assets
    .map((asset) => asset.serialNumber)
    .filter(Boolean)
    .join(', ');

  return { brandAndModel, serialNumbers };
}

export function createClientAccessServicesColumns({
  labels,
  dateFormatter,
}: {
  labels: ClientAccessServicesLabels;
  dateFormatter: Intl.DateTimeFormat;
}): DataTableColumn<ClientAccessCustomerServiceRecord>[] {
  return [
    {
      id: 'serviceNumber',
      header: labels.serviceNumber,
      ariaLabel: labels.serviceNumber,
      accessor: (row) => row.serviceNumberDisplay,
      cell: (row, { highlight }) => (
        <span className="font-mono font-normal text-muted-foreground">
          {highlight(row.serviceNumberDisplay)}
        </span>
      ),
      sorting: { enabled: true, apiField: 'service_number' },
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
      cell: (row, { highlight }) => {
        const assets = formatAssets(row);
        return (
          <div className="min-w-56 space-y-1">
            <p className="font-medium text-foreground">
              {row.assets.length
                ? row.assets.map((asset, index) => (
                    <span key={asset.id}>
                      {index ? ', ' : null}
                      {highlight(asset.name)}
                      {asset.identifier ? (
                        <span className="font-mono text-xs font-normal text-muted-foreground">
                          {' '}
                          [{highlight(asset.identifier)}]
                        </span>
                      ) : null}
                    </span>
                  ))
                : highlight(assets || row.serviceType.name)}
            </p>
            <p className="text-xs text-muted-foreground">{highlight(row.serviceType.name)}</p>
          </div>
        );
      },
      textBehavior: 'wrap',
      width: { initial: 360, min: 260, max: 580, resizable: true },
    },
    {
      id: 'operationalStatus',
      header: labels.operationalStatus,
      ariaLabel: labels.operationalStatus,
      accessor: (row) => row.operationalStatus.name,
      cell: (row) => <BadgeCell label={row.operationalStatus.name} variant="outline" />,
      width: { initial: 148, min: 148, max: 240, resizable: true },
    },
    {
      id: 'customerCommitment',
      header: labels.customerCommitment,
      ariaLabel: labels.customerCommitment,
      accessor: (row) => row.customerDelivery.statusMaterialization?.name ?? labels.noStatus,
      cell: (row) => (
        <BadgeCell
          label={row.customerDelivery.statusMaterialization?.name ?? labels.noStatus}
          color={row.customerDelivery.statusMaterialization?.colorHex}
          variant="subtle"
        />
      ),
      width: { initial: 164, min: 164, max: 280, resizable: true },
    },
    {
      id: 'receivedAt',
      header: labels.receivedAt,
      ariaLabel: labels.receivedAt,
      accessor: (row) => row.customerDelivery.receivedAt ?? '',
      cell: (row) => (
        <DateWithRelativeTimeCell
          value={row.customerDelivery.receivedAt}
          dateFormatter={dateFormatter}
          emptyLabel={labels.noDate}
        />
      ),
      sorting: { enabled: true, apiField: 'received_at' },
      width: { initial: 146, min: 132, max: 190, resizable: true },
    },
    {
      id: 'deliveryAt',
      header: labels.deliveryAt,
      ariaLabel: labels.deliveryAt,
      accessor: (row) =>
        row.customerDelivery.deliveredToCustomerAt ??
        row.customerDelivery.estimatedDeliveryAt ??
        '',
      cell: (row) => {
        const deliveredAt = row.customerDelivery.deliveredToCustomerAt;
        const value = deliveredAt ?? row.customerDelivery.estimatedDeliveryAt;
        return (
          <DateWithRelativeTimeCell
            value={value}
            dateFormatter={dateFormatter}
            emptyLabel={labels.noDate}
            label={value ? (deliveredAt ? labels.delivered : labels.estimated) : undefined}
          />
        );
      },
      width: { initial: 170, min: 148, max: 220, resizable: true },
    },
    {
      id: 'equipmentDetails',
      header: labels.equipmentDetails,
      ariaLabel: labels.equipmentDetails,
      accessor: (row) => {
        const { brandAndModel, serialNumbers } = formatEquipmentDetails(row);
        return [brandAndModel, serialNumbers].filter(Boolean).join(' ');
      },
      cell: (row, { highlight }) => {
        const { brandAndModel, serialNumbers } = formatEquipmentDetails(row);
        return (
          <div className="min-w-48 space-y-1">
            <p className="truncate" title={brandAndModel || undefined}>
              {highlight(brandAndModel || '—')}
            </p>
            <p
              className="truncate font-mono text-xs font-normal text-muted-foreground"
              title={serialNumbers || undefined}
            >
              {highlight(serialNumbers || '—')}
            </p>
          </div>
        );
      },
      textBehavior: 'wrap',
      width: { initial: 240, min: 200, max: 360, resizable: true },
    },
    {
      id: 'customer',
      header: labels.customer,
      ariaLabel: labels.customer,
      accessor: (row) => row.customer.name,
      cell: (row) => (
        <span className="block truncate" title={row.customer.name}>
          {row.customer.name}
        </span>
      ),
      textBehavior: 'truncate',
      width: { initial: 280, min: 180, max: 420, resizable: true },
    },
  ];
}
