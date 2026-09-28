'use client';

import { useState } from 'react';

import { DocumentCollection } from '@/components/documents/DocumentCollection';
import type {
  CustomerServiceRecordDetail,
  CustomerServiceRecordDocumentType,
} from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { CustomerServiceRecordDocumentForm } from './CustomerServiceRecordDocumentForm';

type CustomerServiceRecordDocumentsSectionProps = {
  canUpdate: boolean;
  onSubmit: (input: {
    documentType: CustomerServiceRecordDocumentType;
    existingFileIds: string[];
    files: File[];
    referenceNumber?: string | null;
  }) => Promise<{ message: string | null; record: CustomerServiceRecordDetail }>;
  record: CustomerServiceRecordDetail;
};

export function CustomerServiceRecordDocumentsSection({
  canUpdate,
  onSubmit,
  record,
}: CustomerServiceRecordDocumentsSectionProps) {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const [expandedDocumentType, setExpandedDocumentType] =
    useState<CustomerServiceRecordDocumentType | null>(null);

  const documentFormProps = (documentType: CustomerServiceRecordDocumentType) => ({
    expanded: expandedDocumentType === documentType,
    onExpandedChange: (expanded: boolean) =>
      setExpandedDocumentType(expanded ? documentType : null),
  });

  return (
    <DocumentCollection title={t('detail.documents.title')}>
      <CustomerServiceRecordDocumentForm
        canUpdate={canUpdate}
        documentType="quotation"
        {...documentFormProps('quotation')}
        files={record.quotation.files}
        hasReferenceNumber
        onSubmit={onSubmit}
        referenceNumber={record.quotation.referenceNumber}
        title={t('detail.documents.quotation.title')}
      />
      <CustomerServiceRecordDocumentForm
        canUpdate={canUpdate}
        documentType="purchase-order"
        {...documentFormProps('purchase-order')}
        files={record.purchaseOrder.files}
        hasReferenceNumber
        onSubmit={onSubmit}
        referenceNumber={record.purchaseOrder.referenceNumber}
        title={t('detail.documents.purchaseOrder.title')}
      />
      <CustomerServiceRecordDocumentForm
        canUpdate={canUpdate}
        documentType="invoice"
        {...documentFormProps('invoice')}
        files={record.invoice.files}
        hasReferenceNumber
        onSubmit={onSubmit}
        referenceNumber={record.invoice.referenceNumber}
        title={t('detail.documents.invoice.title')}
      />
      <CustomerServiceRecordDocumentForm
        canUpdate={canUpdate}
        documentType="other-files"
        {...documentFormProps('other-files')}
        files={record.otherFiles}
        hasReferenceNumber={false}
        onSubmit={onSubmit}
        title={t('detail.documents.otherFiles.title')}
      />
    </DocumentCollection>
  );
}
