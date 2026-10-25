'use client';

import { useState } from 'react';

import { CustomerServiceRecordDocumentForm } from '@/components/customer-service-records/CustomerServiceRecordDocumentForm';
import { DocumentCollectionList } from '@/components/documents/DocumentCollection';
import { FormReadValue } from '@/components/forms';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import type { BillingCustomerServiceRecord } from '@/features/billing-customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useBillingCustomerServiceRecordInvoiceWorkflow } from './useBillingCustomerServiceRecordInvoiceWorkflow';

type Props = { canUpdate: boolean; record: BillingCustomerServiceRecord };

export function BillingCustomerServiceRecordInvoiceSection({ canUpdate, record }: Props) {
  const { t, i18n } = useTranslationHydrated('billingCustomerServiceRecords');
  const [expanded, setExpanded] = useState(false);
  const { saveInvoice, retryMark } = useBillingCustomerServiceRecordInvoiceWorkflow(
    record.customerServiceRecordId
  );
  const lastNotice = record.billingNotification.sentAt ?? record.billingNotification.attemptedAt;
  const formattedNotice =
    lastNotice && !Number.isNaN(new Date(lastNotice).getTime())
      ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
          new Date(lastNotice)
        )
      : '—';

  return (
    <section className="scroll-mt-24 md:scroll-mt-5" id="billing" tabIndex={-1}>
      <ResourceFormFrame
        contentSurface={{ base: 'bare', md: 'inset' }}
        density={{ base: 'compact', md: 'comfortable' }}
        dividers="hidden"
        headerDensity="compact"
        mode="read"
        surface={{ base: 'bare', md: 'card' }}
        title={t('detail.billing.title')}
      >
        <ResourceFormSection surface="bare">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t('detail.billing.status')}
              </p>
              <FormReadValue>{record.billingStatus.name}</FormReadValue>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t('detail.billing.notification')}
              </p>
              <FormReadValue>{record.billingNotification.status.name}</FormReadValue>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t('detail.billing.lastNotice')}
              </p>
              <FormReadValue>{formattedNotice}</FormReadValue>
            </div>
          </div>
        </ResourceFormSection>
        <DocumentCollectionList className="border-t border-border/70 pt-2">
          <CustomerServiceRecordDocumentForm
            canUpdate={canUpdate}
            collectionId="billing-invoice"
            expanded={expanded}
            files={record.invoice.files}
            hasReferenceNumber
            markAction={
              record.billingStatus.code === 'SUBMITTED'
                ? { label: t('invoice.saveAndMark'), loadingLabel: t('invoice.savingAndMarking') }
                : undefined
            }
            onExpandedChange={setExpanded}
            onRetryPartial={retryMark}
            onSubmit={saveInvoice}
            referenceNumber={record.invoice.referenceNumber}
            requireFile={record.billingStatus.code === 'INVOICED'}
            title={t('detail.billing.invoice')}
          />
        </DocumentCollectionList>
      </ResourceFormFrame>
    </section>
  );
}
