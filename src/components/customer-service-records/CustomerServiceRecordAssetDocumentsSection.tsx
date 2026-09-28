'use client';

import { useState } from 'react';

import { DocumentCollectionList } from '@/components/documents/DocumentCollection';
import type {
  CustomerServiceRecordAttachment,
  CustomerServiceRecordDetail,
} from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { CustomerServiceRecordDocumentForm } from './CustomerServiceRecordDocumentForm';

type CustomerServiceRecordAsset = CustomerServiceRecordDetail['assets'][number];

type CustomerServiceRecordAssetDocumentType = 'intake-condition' | 'delivery-condition' | 'reports';

type CustomerServiceRecordAssetDocumentsSectionProps = {
  asset: CustomerServiceRecordAsset;
  canUpdate: boolean;
  onSubmit: (input: {
    asset: CustomerServiceRecordAsset;
    documentType: CustomerServiceRecordAssetDocumentType;
    existingFileIds: string[];
    files: File[];
  }) => Promise<{ message: string | null; record: CustomerServiceRecordDetail }>;
};

export function CustomerServiceRecordAssetDocumentsSection({
  asset,
  canUpdate,
  onSubmit,
}: CustomerServiceRecordAssetDocumentsSectionProps) {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const [expandedDocumentType, setExpandedDocumentType] =
    useState<CustomerServiceRecordAssetDocumentType | null>(null);

  const documentFormProps = (documentType: CustomerServiceRecordAssetDocumentType) => ({
    expanded: expandedDocumentType === documentType,
    onExpandedChange: (expanded: boolean) =>
      setExpandedDocumentType(expanded ? documentType : null),
  });

  const submitDocument =
    (documentType: CustomerServiceRecordAssetDocumentType) =>
    async ({ existingFileIds, files }: { existingFileIds: string[]; files: File[] }) => {
      const result = await onSubmit({ asset, documentType, existingFileIds, files });
      const updatedAsset = result.record.assets.find((item) => item.assetId === asset.assetId);

      return {
        files: getAssetDocumentFiles(updatedAsset ?? asset, documentType),
        message: result.message,
      };
    };

  return (
    <DocumentCollectionList className="border-t border-border/70 pt-2">
      <CustomerServiceRecordDocumentForm
        canUpdate={canUpdate}
        collectionId={`${asset.assetId}-intake-condition`}
        {...documentFormProps('intake-condition')}
        files={asset.intakeConditionFiles}
        hasReferenceNumber={false}
        onSubmit={submitDocument('intake-condition')}
        title={t('detail.equipment.documents.intakeCondition')}
      />
      <CustomerServiceRecordDocumentForm
        canUpdate={canUpdate}
        collectionId={`${asset.assetId}-delivery-condition`}
        {...documentFormProps('delivery-condition')}
        files={asset.deliveryConditionFiles}
        hasReferenceNumber={false}
        onSubmit={submitDocument('delivery-condition')}
        title={t('detail.equipment.documents.deliveryCondition')}
      />
      <CustomerServiceRecordDocumentForm
        canUpdate={canUpdate}
        collectionId={`${asset.assetId}-reports`}
        {...documentFormProps('reports')}
        files={asset.reports}
        hasReferenceNumber={false}
        onSubmit={submitDocument('reports')}
        title={t('detail.equipment.documents.reports')}
      />
    </DocumentCollectionList>
  );
}

function getAssetDocumentFiles(
  asset: CustomerServiceRecordAsset,
  documentType: CustomerServiceRecordAssetDocumentType
): CustomerServiceRecordAttachment[] {
  switch (documentType) {
    case 'intake-condition':
      return asset.intakeConditionFiles;
    case 'delivery-condition':
      return asset.deliveryConditionFiles;
    case 'reports':
      return asset.reports;
  }
}

export type { CustomerServiceRecordAssetDocumentType };
