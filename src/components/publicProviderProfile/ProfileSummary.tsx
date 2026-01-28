import { BadgeCheck } from 'lucide-react';

import type { PublicProviderProfile } from '@/features/publicProviderProfile/types';
import { getProviderProfileTone, getProviderStatusTone } from '@/components/providers/status';
import { cn } from '@/lib/utils';

interface PublicProviderProfileSummaryProps {
  profile: PublicProviderProfile;
  labels: {
    status: string;
    providerCode: string;
    fiscalStatus: string;
    bankingStatus: string;
    lastUpdated: string;
  };
  formatDate: (value: string | null) => string;
}

export function PublicProviderProfileSummary({
  profile,
  labels,
  formatDate,
}: PublicProviderProfileSummaryProps) {
  return (
    <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{labels.providerCode}</p>
          <h2 className="text-2xl font-semibold">{profile.companyName}</h2>
          <p className="text-sm text-muted-foreground">{profile.providerCode}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold',
              getProviderStatusTone(profile.statusId)
            )}
          >
            <BadgeCheck className="size-4" aria-hidden />
            {profile.statusName}
          </span>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 md:grid-cols-3">
        <Detail
          label={labels.fiscalStatus}
          value={profile.fiscalProfile?.statusName ?? '—'}
          tone={profile.fiscalProfile?.statusId}
        />
        <Detail
          label={labels.bankingStatus}
          value={profile.bankingInfo?.statusName ?? '—'}
          tone={profile.bankingInfo?.statusId}
        />
        <Detail label={labels.lastUpdated} value={formatDate(profile.updatedAt)} />
      </dl>
    </section>
  );
}

function Detail({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-foreground">
        {tone ? (
          <span
            className={cn(
              'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
              getProviderProfileTone(tone)
            )}
          >
            {value}
          </span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
