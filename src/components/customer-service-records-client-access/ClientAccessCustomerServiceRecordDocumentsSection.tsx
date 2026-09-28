'use client';

import { useState } from 'react';

import {
  DocumentCollection,
  DocumentCollectionList,
} from '@/components/documents/DocumentCollection';
import {
  DocumentCollectionReadOnlyItem,
  type DocumentCollectionReadOnlyCopy,
} from '@/components/documents/DocumentCollectionReadOnlyItem';
import type {
  ClientAccessAssetDetail,
  ClientAccessCustomerServiceRecordDetail,
} from '@/features/customer-service-records-client-access';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type ClientAccessCustomerServiceRecordDocumentsSectionProps = {
  record: ClientAccessCustomerServiceRecordDetail;
};

export function ClientAccessCustomerServiceRecordDocumentsSection({
  record,
}: ClientAccessCustomerServiceRecordDocumentsSectionProps) {
  const { t } = useTranslationHydrated('clientAccessServices');
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);
  const copy = getDocumentCopy(t);

  return (
    <DocumentCollection title={t('detail.sections.documents')}>
      <DocumentCollectionReadOnlyItem
        collectionId="quotation"
        copy={copy}
        expanded={expandedCollection === 'quotation'}
        files={record.quotation.files}
        onExpandedChange={(expanded) => setExpandedCollection(expanded ? 'quotation' : null)}
        referenceLabel={t('detail.documents.reference')}
        referenceNumber={record.quotation.referenceNumber || '—'}
        title={t('detail.documents.quotation')}
      />
      <DocumentCollectionReadOnlyItem
        collectionId="purchase-order"
        copy={copy}
        expanded={expandedCollection === 'purchase-order'}
        files={record.purchaseOrder.files}
        onExpandedChange={(expanded) => setExpandedCollection(expanded ? 'purchase-order' : null)}
        referenceLabel={t('detail.documents.reference')}
        referenceNumber={record.purchaseOrder.referenceNumber || '—'}
        title={t('detail.documents.purchaseOrder')}
      />
      <DocumentCollectionReadOnlyItem
        collectionId="invoice"
        copy={copy}
        expanded={expandedCollection === 'invoice'}
        files={record.invoice.files}
        onExpandedChange={(expanded) => setExpandedCollection(expanded ? 'invoice' : null)}
        referenceLabel={t('detail.documents.reference')}
        referenceNumber={record.invoice.referenceNumber || '—'}
        title={t('detail.documents.invoice')}
      />
      <DocumentCollectionReadOnlyItem
        collectionId="other-files"
        copy={copy}
        expanded={expandedCollection === 'other-files'}
        files={record.otherFiles}
        onExpandedChange={(expanded) => setExpandedCollection(expanded ? 'other-files' : null)}
        title={t('detail.documents.otherFiles')}
      />
    </DocumentCollection>
  );
}

type ClientAccessCustomerServiceRecordAssetDocumentsSectionProps = {
  asset: ClientAccessAssetDetail;
};

export function ClientAccessCustomerServiceRecordAssetDocumentsSection({
  asset,
}: ClientAccessCustomerServiceRecordAssetDocumentsSectionProps) {
  const { t } = useTranslationHydrated('clientAccessServices');
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);
  const copy = getDocumentCopy(t);
  const collectionId = (type: string) => `${asset.id}-${type}`;

  return (
    <DocumentCollectionList className="border-t border-border/70 pt-2">
      <DocumentCollectionReadOnlyItem
        collectionId={collectionId('intake-condition')}
        copy={copy}
        expanded={expandedCollection === 'intake-condition'}
        files={asset.intakeConditionFiles}
        onExpandedChange={(expanded) => setExpandedCollection(expanded ? 'intake-condition' : null)}
        title={t('detail.equipment.documents.intakeCondition')}
      />
      <DocumentCollectionReadOnlyItem
        collectionId={collectionId('delivery-condition')}
        copy={copy}
        expanded={expandedCollection === 'delivery-condition'}
        files={asset.deliveryConditionFiles}
        onExpandedChange={(expanded) =>
          setExpandedCollection(expanded ? 'delivery-condition' : null)
        }
        title={t('detail.equipment.documents.deliveryCondition')}
      />
      <DocumentCollectionReadOnlyItem
        collectionId={collectionId('reports')}
        copy={copy}
        expanded={expandedCollection === 'reports'}
        files={asset.reports}
        onExpandedChange={(expanded) => setExpandedCollection(expanded ? 'reports' : null)}
        title={t('detail.equipment.documents.reports')}
      />
    </DocumentCollectionList>
  );
}

function getDocumentCopy(t: (key: string, options?: { count: number }) => string) {
  return {
    closeFiles: t('detail.documents.closeFiles'),
    download: t('detail.documents.download'),
    empty: t('detail.documents.empty'),
    emptyFolder: t('detail.documents.emptyFolder'),
    fileCount: (count: number) => t('detail.documents.fileCount', { count }),
    nextImage: t('detail.documents.nextImage'),
    openFiles: t('detail.documents.openFiles'),
    previousImage: t('detail.documents.previousImage'),
    preview: t('detail.documents.preview'),
  } satisfies DocumentCollectionReadOnlyCopy;
}
