import { PageHeader } from '@/components/page-header';

type CustomerServiceRecordAssetContext = {
  name: string;
  identifier: string;
  brand: string;
  model: string;
};

type CustomerServiceRecordAssetPageHeaderProps = {
  asset: CustomerServiceRecordAssetContext | null | undefined;
  labels: {
    unnamedAsset: string;
    brand: string;
    model: string;
    identifier: string;
  };
};

/** Provides persistent asset identity above the independently scrolling record sections. */
export function CustomerServiceRecordAssetPageHeader({
  asset,
  labels,
}: CustomerServiceRecordAssetPageHeaderProps) {
  if (!asset) return null;

  const metadata = [
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
