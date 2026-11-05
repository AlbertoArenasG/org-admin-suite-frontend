'use client';

import { useState } from 'react';
import { CustomerServiceRecordDocumentForm } from '@/components/customer-service-records/CustomerServiceRecordDocumentForm';
import { DocumentCollectionList } from '@/components/documents/DocumentCollection';
import { Button } from '@/components/ui/button';
import type { BillingCustomerServiceRecord } from '@/features/billing-customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useBillingDocumentSubmission } from './useBillingDocumentSubmission';

type Props = { canUpdate: boolean; record: BillingCustomerServiceRecord };

function ComplementForm({
  recordId,
  complementId,
  files,
  referenceNumber,
  title,
  canUpdate,
  onSaved,
}: {
  recordId: string;
  complementId: string | null;
  files: BillingCustomerServiceRecord['invoice']['files'];
  referenceNumber: string | null;
  title: string;
  canUpdate: boolean;
  onSaved?: () => void;
}) {
  const { saveComplement } = useBillingDocumentSubmission(recordId);
  const [expanded, setExpanded] = useState(false);
  return (
    <CustomerServiceRecordDocumentForm
      canUpdate={canUpdate}
      collectionId={`billing-complement-${complementId ?? 'new'}`}
      expanded={expanded}
      files={files}
      hasReferenceNumber
      onExpandedChange={setExpanded}
      onSubmit={async (input) => {
        const result = await saveComplement(complementId, input);
        onSaved?.();
        return result;
      }}
      referenceNumber={referenceNumber}
      title={title}
    />
  );
}

export function BillingCustomerServiceRecordPaymentComplements({ canUpdate, record }: Props) {
  const { t } = useTranslationHydrated('billingCustomerServiceRecords');
  const [newComplement, setNewComplement] = useState(false);
  const [newComplementKey, setNewComplementKey] = useState(0);
  const complements = record.invoice.paymentComplements;

  return (
    <div className="border-t border-border/70 pt-4">
      <h3 className="mb-2 px-3 text-sm font-semibold sm:px-4">{t('documents.complementsTitle')}</h3>
      <DocumentCollectionList>
        {complements.map((complement, index) => (
          <ComplementForm
            key={complement.complementId}
            recordId={record.customerServiceRecordId}
            complementId={complement.complementId}
            files={complement.files}
            referenceNumber={complement.referenceNumber}
            title={t('documents.complement', { number: index + 1 })}
            canUpdate={canUpdate}
          />
        ))}
        {newComplement ? (
          <ComplementForm
            key={`new-${newComplementKey}`}
            recordId={record.customerServiceRecordId}
            complementId={null}
            files={[]}
            referenceNumber={null}
            title={t('documents.newComplement')}
            canUpdate={canUpdate}
            onSaved={() => setNewComplement(false)}
          />
        ) : null}
      </DocumentCollectionList>
      {canUpdate ? (
        <div className="mt-4 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => {
              setNewComplement(!newComplement);
              if (!newComplement) setNewComplementKey((value) => value + 1);
            }}
          >
            {t(newComplement ? 'lifecycle.cancel' : 'documents.addComplement')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
