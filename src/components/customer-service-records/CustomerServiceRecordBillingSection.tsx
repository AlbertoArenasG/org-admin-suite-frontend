'use client';

import { Send } from 'lucide-react';

import { FormReadValue } from '@/components/forms';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { Button } from '@/components/ui/button';
import type { CustomerServiceRecordDetail } from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type Props = {
  record: CustomerServiceRecordDetail;
  canUpdate: boolean;
  onSend: () => void;
};

export function CustomerServiceRecordBillingSection({ record, canUpdate, onSend }: Props) {
  const { t, i18n } = useTranslationHydrated('customerServiceRecords');
  const notification = record.billingNotification;
  const lastAttempt = notification.sentAt ?? notification.attemptedAt;
  const formattedAttempt = lastAttempt
    ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(lastAttempt)
      )
    : t('billing.section.noAttempt');

  return (
    <ResourceFormFrame
      contentSurface={{ base: 'bare', md: 'inset' }}
      density={{ base: 'compact', md: 'comfortable' }}
      dividers="hidden"
      headerDensity="compact"
      headerActions={
        canUpdate && record.billingStatus.code === 'NOT_SUBMITTED' ? (
          <Button size="sm" type="button" onClick={onSend}>
            <Send aria-hidden="true" className="size-4" />
            {t('billing.send.action')}
          </Button>
        ) : null
      }
      mode="read"
      surface={{ base: 'bare', md: 'card' }}
      title={t('billing.section.title')}
    >
      <ResourceFormSection surface="bare">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {t('billing.section.status')}
            </p>
            <FormReadValue>{record.billingStatus.name}</FormReadValue>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {t('billing.section.notification')}
            </p>
            <FormReadValue>{notification.status.name}</FormReadValue>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {t('billing.section.lastAttempt')}
            </p>
            <FormReadValue>{formattedAttempt}</FormReadValue>
          </div>
        </div>
      </ResourceFormSection>
    </ResourceFormFrame>
  );
}
