'use client';

import type { TFunction } from 'i18next';

import type { ExpirationNotificationPolicyOffset } from '@/features/expiration-notification-policies/types';

type Translate = TFunction<'expirationNotificationPolicies', undefined>;

export function formatExpirationNotificationPolicyOffset(
  offset: ExpirationNotificationPolicyOffset | null,
  t: Translate
) {
  if (!offset) {
    return '—';
  }

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

  if (!parts.length) {
    return t('offset.sameDay');
  }

  return parts.join(' · ');
}
