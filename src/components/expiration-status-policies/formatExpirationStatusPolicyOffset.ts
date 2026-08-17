import type { TFunction } from 'i18next';

import type { ExpirationStatusPolicyOffset } from '@/features/expiration-status-policies/types';

type Translate = TFunction<'expirationStatusPolicies', undefined>;

export function formatExpirationStatusPolicyOffset(
  offset: ExpirationStatusPolicyOffset,
  t: Translate
) {
  const parts: string[] = [];

  if (offset.years > 0) {
    parts.push(t('offset.years', { count: offset.years }));
  }

  if (offset.months > 0) {
    parts.push(t('offset.months', { count: offset.months }));
  }

  if (offset.weeks > 0) {
    parts.push(t('offset.weeks', { count: offset.weeks }));
  }

  if (offset.days > 0) {
    parts.push(t('offset.days', { count: offset.days }));
  }

  if (parts.length === 0) {
    return t('offset.sameDay');
  }

  return parts.join(', ');
}
