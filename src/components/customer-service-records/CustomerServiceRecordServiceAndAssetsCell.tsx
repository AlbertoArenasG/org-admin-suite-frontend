import type { ReactNode } from 'react';

import type { CustomerServiceRecordListItem } from '@/features/customer-service-records';

type Props = {
  row: CustomerServiceRecordListItem;
  highlight: (value: string) => ReactNode;
};

export function CustomerServiceRecordServiceAndAssetsCell({ row, highlight }: Props) {
  return (
    <div className="min-w-56 space-y-1">
      <p className="font-medium text-foreground">
        {row.assets.length
          ? row.assets.map((asset, index) => (
              <span key={asset.assetId}>
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
          : highlight(row.serviceType.name)}
      </p>
      <p className="text-xs text-muted-foreground">{highlight(row.serviceType.name)}</p>
    </div>
  );
}
