import { PageHeader } from '@/components/page-header';

type CustomerServiceRecordAssetContext = {
  name: string;
  identifier: string;
  brand: string;
  model: string;
};

type CustomerServiceRecordAssetPageHeaderProps = {
  asset: CustomerServiceRecordAssetContext | null | undefined;
  customerName?: string | null;
  labels: {
    unnamedAsset: string;
    brand: string;
    model: string;
    identifier: string;
    customer?: string;
  };
};

/** Provides persistent asset identity above the independently scrolling record sections. */
export function CustomerServiceRecordAssetPageHeader({
  asset,
  customerName,
  labels,
}: CustomerServiceRecordAssetPageHeaderProps) {
  if (!asset) return null;

  const metadata = [
    ...(customerName?.trim() && labels.customer
      ? [{ label: labels.customer, value: customerName }]
      : []),
    { label: labels.brand, value: asset.brand },
    { label: labels.model, value: asset.model },
    { label: labels.identifier, value: asset.identifier },
  ].filter(({ value }) => value.trim());

  return (
    <PageHeader
      density="compact"
      metadata={
        metadata.length ? (
          <>
            {metadata.map(({ label, value }) => (
              <span key={label}>
                <span className="font-medium">{label}: </span>
                {value}
              </span>
            ))}
          </>
        ) : undefined
      }
      title={asset.name.trim() || labels.unnamedAsset}
    />
  );
}
