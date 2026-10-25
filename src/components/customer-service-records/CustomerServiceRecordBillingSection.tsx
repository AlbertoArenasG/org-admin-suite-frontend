'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

import { DocumentCollectionList } from '@/components/documents/DocumentCollection';
import { FormReadValue } from '@/components/forms';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { Button } from '@/components/ui/button';
import type {
  CustomerServiceRecordDetail,
  CustomerServiceRecordDocumentType,
} from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  CustomerServiceRecordDocumentForm,
  type CustomerServiceRecordDocumentSubmissionItem,
} from './CustomerServiceRecordDocumentForm';

type Props = {
  record: CustomerServiceRecordDetail;
  canUpdate: boolean;
  onSend: () => void;
  onSubmit: (input: {
    documentType: CustomerServiceRecordDocumentType;
    items: CustomerServiceRecordDocumentSubmissionItem[];
    referenceNumber?: string | null;
  }) => Promise<{ message: string | null; record: CustomerServiceRecordDetail }>;
};

export function CustomerServiceRecordBillingSection({
  record,
  canUpdate,
  onSend,
  onSubmit,
}: Props) {
  const { t, i18n } = useTranslationHydrated('customerServiceRecords');
  const [invoiceExpanded, setInvoiceExpanded] = useState(false);
  const notification = record.billingNotification;
  const noticeAt = notification.sentAt ?? notification.attemptedAt;
  const noticeDate = noticeAt
    ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(noticeAt)
      )
    : null;

  const submitInvoice = async ({
    items,
    referenceNumber,
  }: {
    items: CustomerServiceRecordDocumentSubmissionItem[];
    referenceNumber?: string | null;
  }) => {
    const result = await onSubmit({ documentType: 'invoice', items, referenceNumber });
    return {
      files: result.record.invoice.files,
      message: result.message,
      referenceNumber: result.record.invoice.referenceNumber,
    };
  };

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
            <FormReadValue>
              {notification.status.name}
              {noticeDate ? <span className="text-muted-foreground"> · {noticeDate}</span> : null}
            </FormReadValue>
          </div>
        </div>
      </ResourceFormSection>
      <DocumentCollectionList className="border-t border-border/70 pt-2">
        <CustomerServiceRecordDocumentForm
          canUpdate={canUpdate}
          collectionId="invoice"
          expanded={invoiceExpanded}
          files={record.invoice.files}
          hasReferenceNumber
          onExpandedChange={setInvoiceExpanded}
          onSubmit={submitInvoice}
          referenceNumber={record.invoice.referenceNumber}
          requireFile={record.billingStatus.code === 'INVOICED'}
          title={t('detail.documents.invoice.title')}
        />
      </DocumentCollectionList>
    </ResourceFormFrame>
  );
}
