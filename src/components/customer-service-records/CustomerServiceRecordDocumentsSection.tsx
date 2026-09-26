'use client';

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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{t('detail.documents.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('detail.documents.description')}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CustomerServiceRecordDocumentForm
          canUpdate={canUpdate}
          description={t('detail.documents.quotation.description')}
          documentType="quotation"
          files={record.quotation.files}
          hasReferenceNumber
          onSubmit={onSubmit}
          referenceNumber={record.quotation.referenceNumber}
          title={t('detail.documents.quotation.title')}
        />
        <CustomerServiceRecordDocumentForm
          canUpdate={canUpdate}
          description={t('detail.documents.purchaseOrder.description')}
          documentType="purchase-order"
          files={record.purchaseOrder.files}
          hasReferenceNumber
          onSubmit={onSubmit}
          referenceNumber={record.purchaseOrder.referenceNumber}
          title={t('detail.documents.purchaseOrder.title')}
        />
        <CustomerServiceRecordDocumentForm
          canUpdate={canUpdate}
          description={t('detail.documents.invoice.description')}
          documentType="invoice"
          files={record.invoice.files}
          hasReferenceNumber
          onSubmit={onSubmit}
          referenceNumber={record.invoice.referenceNumber}
          title={t('detail.documents.invoice.title')}
        />
        <CustomerServiceRecordDocumentForm
          canUpdate={canUpdate}
          description={t('detail.documents.otherFiles.description')}
          documentType="other-files"
          files={record.otherFiles}
          hasReferenceNumber={false}
          onSubmit={onSubmit}
          title={t('detail.documents.otherFiles.title')}
        />
      </div>
    </div>
  );
}
