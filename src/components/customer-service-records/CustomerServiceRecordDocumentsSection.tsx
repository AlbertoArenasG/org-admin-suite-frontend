'use client';

import { useState } from 'react';

import { DocumentCollection } from '@/components/documents/DocumentCollection';
import type {
  CustomerServiceRecordDetail,
  CustomerServiceRecordDocumentType,
} from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  CustomerServiceRecordDocumentForm,
  type CustomerServiceRecordDocumentSubmissionItem,
} from './CustomerServiceRecordDocumentForm';

type CustomerServiceRecordDocumentsSectionProps = {
  canUpdate: boolean;
  onSubmit: (input: {
    documentType: CustomerServiceRecordDocumentType;
    items: CustomerServiceRecordDocumentSubmissionItem[];
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

  const submitDocument =
    (documentType: CustomerServiceRecordDocumentType) =>
    async ({
      items,
      referenceNumber,
    }: {
      items: CustomerServiceRecordDocumentSubmissionItem[];
      referenceNumber?: string | null;
    }) => {
      const result = await onSubmit({ documentType, items, referenceNumber });
      const document = getDocument(record, result.record, documentType);

      return {
        files: document.files,
        message: result.message,
        referenceNumber: document.referenceNumber,
      };
    };

  return (
    <DocumentCollection title={t('detail.documents.title')}>
      <CustomerServiceRecordDocumentForm
        canUpdate={canUpdate}
        collectionId="quotation"
        {...documentFormProps('quotation')}
        files={record.quotation.files}
        hasReferenceNumber
        onSubmit={submitDocument('quotation')}
        referenceNumber={record.quotation.referenceNumber}
        title={t('detail.documents.quotation.title')}
      />
      <CustomerServiceRecordDocumentForm
        canUpdate={canUpdate}
        collectionId="purchase-order"
        {...documentFormProps('purchase-order')}
        files={record.purchaseOrder.files}
        hasReferenceNumber
        onSubmit={submitDocument('purchase-order')}
        referenceNumber={record.purchaseOrder.referenceNumber}
        title={t('detail.documents.purchaseOrder.title')}
      />
      <CustomerServiceRecordDocumentForm
        canUpdate={canUpdate}
        collectionId="invoice"
        {...documentFormProps('invoice')}
        files={record.invoice.files}
        hasReferenceNumber
        onSubmit={submitDocument('invoice')}
        referenceNumber={record.invoice.referenceNumber}
        title={t('detail.documents.invoice.title')}
      />
      <CustomerServiceRecordDocumentForm
        canUpdate={canUpdate}
        collectionId="other-files"
        {...documentFormProps('other-files')}
        files={record.otherFiles}
        hasReferenceNumber={false}
        onSubmit={submitDocument('other-files')}
        title={t('detail.documents.otherFiles.title')}
      />
    </DocumentCollection>
  );
}

function getDocument(
  fallbackRecord: CustomerServiceRecordDetail,
  record: CustomerServiceRecordDetail,
  documentType: CustomerServiceRecordDocumentType
) {
  const source = record ?? fallbackRecord;

  switch (documentType) {
    case 'quotation':
      return source.quotation;
    case 'purchase-order':
      return source.purchaseOrder;
    case 'invoice':
      return source.invoice;
    case 'other-files':
      return { files: source.otherFiles, referenceNumber: null };
  }
}
