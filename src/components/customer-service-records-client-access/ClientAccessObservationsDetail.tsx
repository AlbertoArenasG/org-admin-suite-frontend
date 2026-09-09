import type { ClientAccessCustomerServiceRecord } from '@/features/customer-service-records-client-access';

type ClientAccessObservationsLabels = {
  general: string;
  assets: string;
};

export function hasClientAccessObservations(row: ClientAccessCustomerServiceRecord) {
  return (
    Boolean(row.observations?.trim()) ||
    row.assets.some((asset) => Boolean(asset.observations?.trim()))
  );
}

export function ClientAccessObservationsDetail({
  row,
  labels,
}: {
  row: ClientAccessCustomerServiceRecord;
  labels: ClientAccessObservationsLabels;
}) {
  const assetsWithObservations = row.assets.filter((asset) => asset.observations?.trim());

  return (
    <div className="max-w-3xl space-y-5 text-sm">
      {row.observations?.trim() ? (
        <section className="space-y-1">
          <p className="font-medium text-foreground">{labels.general}</p>
          <p className="whitespace-pre-wrap text-muted-foreground">{row.observations}</p>
        </section>
      ) : null}
      {assetsWithObservations.length ? (
        <section className="space-y-3">
          <p className="font-medium text-foreground">{labels.assets}</p>
          <div className="space-y-3">
            {assetsWithObservations.map((asset) => (
              <article key={asset.id} className="border-l-2 border-primary/40 pl-3">
                <p className="font-medium text-foreground">
                  {asset.name} {asset.identifier ? `(${asset.identifier})` : ''}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                  {asset.observations}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
