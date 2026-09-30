'use client';

import { useState } from 'react';

import { DocumentCollectionList } from '@/components/documents/DocumentCollection';
import {
  DocumentCollectionReadOnlyItem,
  type DocumentCollectionReadOnlyCopy,
} from '@/components/documents/DocumentCollectionReadOnlyItem';
import { FormField, FormReadValue } from '@/components/forms';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { Separator } from '@/components/ui/separator';
import {
  isServicePackageRecordDocumentAttachment,
  type ServicePackageRecordAttachment,
  type ServicePackageRecordDetail,
} from '@/features/servicePackagesRecords';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type ServicePackageRecordAdditionalInformationSectionProps = {
  record: ServicePackageRecordDetail;
};

export function ServicePackageRecordAdditionalInformationSection({
  record,
}: ServicePackageRecordAdditionalInformationSectionProps) {
  const { t } = useTranslationHydrated('servicePackagesRecords');
  const [expanded, setExpanded] = useState(false);
  const files = record.files.filter(isServicePackageRecordDocumentAttachment);

  return (
    <ResourceFormFrame
      contentSurface={{ base: 'bare', md: 'inset' }}
      density={{ base: 'compact', md: 'comfortable' }}
      dividers="hidden"
      headerDensity="compact"
      mode="read"
      surface={{ base: 'bare', md: 'card' }}
      title={t('detail.general.additionalInformation')}
    >
      <ResourceFormSection surface="bare">
        <FormField label={t('detail.fields.observations')}>
          <FormReadValue>{record.details.observations?.trim() || '—'}</FormReadValue>
        </FormField>
      </ResourceFormSection>
      <Separator />
      <DocumentCollectionList>
        <DocumentCollectionReadOnlyItem
          collectionId={`${record.id}-collected-files`}
          copy={getDocumentCopy(t)}
          expanded={expanded}
          files={files.map(toReadOnlyAttachment)}
          onExpandedChange={setExpanded}
          title={t('detail.documents.title')}
        />
      </DocumentCollectionList>
    </ResourceFormFrame>
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
