import { BadgeCheck } from 'lucide-react';

import type { PublicCustomerProfile } from '@/features/publicCustomerProfile/types';
import { getCustomerStatusTone } from '@/components/customers';
import { cn } from '@/lib/utils';

interface PublicCustomerProfileSummaryProps {
  profile: PublicCustomerProfile;
  labels: {
    status: string;
    clientCode: string;
    lastUpdated: string;
  };
  formatDate: (value: string | null) => string;
}

export function PublicCustomerProfileSummary({
  profile,
  labels,
  formatDate,
}: PublicCustomerProfileSummaryProps) {
  return (
    <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{labels.clientCode}</p>
          <h2 className="text-2xl font-semibold">{profile.companyName}</h2>
          <p className="text-sm text-muted-foreground">{profile.clientCode}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold',
              getCustomerStatusTone(profile.statusId)
            )}
          >
            <BadgeCheck className="size-4" aria-hidden />
            {profile.statusName}
          </span>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 md:grid-cols-2">
        <Detail label={labels.status} value={profile.fiscalProfile?.statusName ?? '—'} />
        <Detail label={labels.lastUpdated} value={formatDate(profile.updatedAt)} />
      </dl>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
