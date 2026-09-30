'use client';

import { useState } from 'react';

import { DocumentCollection } from '@/components/documents/DocumentCollection';
import {
  DocumentCollectionReadOnlyItem,
  type DocumentCollectionReadOnlyCopy,
} from '@/components/documents/DocumentCollectionReadOnlyItem';
import {
  isServicePackageRecordDocumentAttachment,
  type ServicePackageRecordAttachment,
  type ServicePackageRecordDetail,
} from '@/features/servicePackagesRecords';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type ServicePackageRecordDocumentsSectionProps = {
  record: ServicePackageRecordDetail;
};

export function ServicePackageRecordDocumentsSection({
  record,
}: ServicePackageRecordDocumentsSectionProps) {
  const { t } = useTranslationHydrated('servicePackagesRecords');
  const [expanded, setExpanded] = useState(false);
  const files = record.files.filter(isServicePackageRecordDocumentAttachment);

  return (
    <DocumentCollection title={t('detail.documents.title')}>
      <DocumentCollectionReadOnlyItem
        collectionId={`${record.id}-collected-files`}
        copy={getDocumentCopy(t)}
        expanded={expanded}
        files={files.map(toReadOnlyAttachment)}
        onExpandedChange={setExpanded}
        title={t('detail.documents.title')}
      />
    </DocumentCollection>
  );
}

function toReadOnlyAttachment(file: ServicePackageRecordAttachment) {
  return {
    fileId: file.fileId,
    originalName: file.originalName,
    mimeType: file.mimeType,
    downloadUrl: file.downloadUrl,
    previewUrl: file.previewUrl,
  };
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
