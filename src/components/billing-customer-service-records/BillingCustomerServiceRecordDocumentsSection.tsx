'use client';

import { useState } from 'react';
import { CustomerServiceRecordDocumentForm } from '@/components/customer-service-records/CustomerServiceRecordDocumentForm';
import { DocumentCollection } from '@/components/documents/DocumentCollection';
import type { BillingCustomerServiceRecord } from '@/features/billing-customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useBillingDocumentSubmission } from './useBillingDocumentSubmission';
import { BillingReadDocuments } from './BillingCustomerServiceRecordReadOnlySections';

type Props = { canUpdate: boolean; record: BillingCustomerServiceRecord };

export function BillingCustomerServiceRecordDocumentsSection({ canUpdate, record }: Props) {
  const { t } = useTranslationHydrated('billingCustomerServiceRecords');
  const { savePurchaseOrder } = useBillingDocumentSubmission(record.customerServiceRecordId);
  const [purchaseExpanded, setPurchaseExpanded] = useState(false);
  return (
    <section id="documents" tabIndex={-1} className="scroll-mt-24 md:scroll-mt-5">
      <DocumentCollection title={t('detail.documents.title')}>
        <BillingReadDocuments
          collectionId="billing-quotation"
          files={record.quotation.files}
          referenceNumber={record.quotation.referenceNumber}
          title={t('detail.documents.quotation')}
        />
        <CustomerServiceRecordDocumentForm
          canUpdate={canUpdate}
          collectionId="billing-purchase-order"
          expanded={purchaseExpanded}
          files={record.purchaseOrder.files}
          hasReferenceNumber
          onExpandedChange={setPurchaseExpanded}
          onSubmit={savePurchaseOrder}
          referenceNumber={record.purchaseOrder.referenceNumber}
          title={t('detail.documents.purchaseOrder')}
        />
        <BillingReadDocuments
          collectionId="billing-other-files"
          files={record.otherFiles}
          title={t('detail.documents.otherFiles')}
        />
      </DocumentCollection>
    </section>
  );
}
