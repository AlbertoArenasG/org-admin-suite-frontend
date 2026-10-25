'use client';

import { useState, type ReactNode } from 'react';

import { DocumentCollection } from '@/components/documents/DocumentCollection';
import { DocumentCollectionReadOnlyItem } from '@/components/documents/DocumentCollectionReadOnlyItem';
import { FormReadValue } from '@/components/forms';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import type {
  CustomerServiceRecordAttachment,
  CustomerServiceRecordDetail,
} from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type Props = { record: CustomerServiceRecordDetail };

function ReadField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <FormReadValue>{value || '—'}</FormReadValue>
    </div>
  );
}

function ReadFrame({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="scroll-mt-24 md:scroll-mt-5" id={id} tabIndex={-1}>
      <ResourceFormFrame
        contentSurface={{ base: 'bare', md: 'inset' }}
        density={{ base: 'compact', md: 'comfortable' }}
        dividers="hidden"
        headerDensity="compact"
        mode="read"
        surface={{ base: 'bare', md: 'card' }}
        title={title}
      >
        {children}
      </ResourceFormFrame>
    </section>
  );
}

function ReadDocuments({
  collectionId,
  files,
  title,
  referenceNumber,
}: {
  collectionId: string;
  files: CustomerServiceRecordAttachment[];
  title: string;
  referenceNumber?: string | null;
}) {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const [expanded, setExpanded] = useState(false);
  return (
    <DocumentCollectionReadOnlyItem
      collectionId={collectionId}
      copy={{
        closeFiles: t('detail.documents.closeFiles'),
        download: t('detail.documents.download'),
        empty: t('detail.documents.empty'),
        emptyFolder: t('detail.documents.emptyFolder'),
        fileCount: (count) => t('detail.documents.fileCount', { count }),
        nextImage: t('detail.documents.nextImage'),
        openFiles: t('detail.documents.openFiles'),
        previousImage: t('detail.documents.previousImage'),
        preview: t('detail.documents.preview'),
      }}
      expanded={expanded}
      files={files}
      onExpandedChange={setExpanded}
      referenceLabel={referenceNumber !== undefined ? t('detail.documents.reference') : undefined}
      referenceNumber={referenceNumber !== undefined ? referenceNumber || '—' : undefined}
      title={title}
    />
  );
}

export function BillingCustomerServiceRecordReadOnlySections({ record }: Props) {
  const { t, i18n } = useTranslationHydrated('billingCustomerServiceRecords');
  const formatDate = (value: string | null) =>
    value && !Number.isNaN(new Date(value).getTime())
      ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
          new Date(value)
        )
      : '—';
  return (
    <>
      <ReadFrame id="general-details" title={t('detail.service.title')}>
        <ResourceFormSection surface="bare">
          <div className="grid gap-4 sm:grid-cols-2">
            <ReadField label={t('table.columns.serviceNumber')} value={record.serviceNumber} />
            <ReadField label={t('table.columns.serviceType')} value={record.serviceType.name} />
            <ReadField
              label={t('detail.service.operationalStatus')}
              value={record.operationalStatus.name}
            />
            <ReadField
              label={t('detail.service.requestedAt')}
              value={formatDate(record.requestedAt)}
            />
            <ReadField label={t('detail.service.createdAt')} value={formatDate(record.createdAt)} />
            <ReadField label={t('detail.service.observations')} value={record.observations} />
          </div>
        </ResourceFormSection>
      </ReadFrame>
      <ReadFrame id="customer-delivery" title={t('detail.customerDelivery.title')}>
        <ResourceFormSection surface="bare">
          <div className="grid gap-4 sm:grid-cols-2">
            <ReadField label={t('detail.customer')} value={record.customer.name} />
            <ReadField
              label={t('detail.customerDelivery.contacts')}
              value={record.customer.users.map((user) => `${user.name} (${user.email})`).join(', ')}
            />
            <ReadField
              label={t('detail.customerDelivery.receivedAt')}
              value={formatDate(record.customerDelivery.receivedAt)}
            />
            <ReadField
              label={t('detail.customerDelivery.estimatedAt')}
              value={formatDate(record.customerDelivery.estimatedDeliveryAt)}
            />
            <ReadField
              label={t('detail.customerDelivery.deliveredAt')}
              value={formatDate(record.customerDelivery.deliveredToCustomerAt)}
            />
          </div>
        </ResourceFormSection>
      </ReadFrame>
      <ReadFrame id="equipment" title={t('detail.equipment.title')}>
        <div className="space-y-5">
          {record.assets.length ? (
            record.assets.map((asset) => (
              <ResourceFormSection
                key={asset.assetId}
                surface="bare"
                title={asset.name || t('detail.unnamedAsset')}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <ReadField label={t('detail.identifier')} value={asset.identifier} />
                  <ReadField label={t('detail.brand')} value={asset.brand} />
                  <ReadField label={t('detail.model')} value={asset.model} />
                  <ReadField
                    label={t('detail.equipment.serialNumber')}
                    value={asset.serialNumber}
                  />
                  <ReadField label={t('detail.service.observations')} value={asset.observations} />
                </div>
                <div className="divide-y divide-border/70 border-t border-border/70 pt-2">
                  <ReadDocuments
                    collectionId={`${asset.assetId}-intake`}
                    files={asset.intakeConditionFiles}
                    title={t('detail.equipment.intake')}
                  />
                  <ReadDocuments
                    collectionId={`${asset.assetId}-delivery`}
                    files={asset.deliveryConditionFiles}
                    title={t('detail.equipment.delivery')}
                  />
                  <ReadDocuments
                    collectionId={`${asset.assetId}-reports`}
                    files={asset.reports}
                    title={t('detail.equipment.reports')}
                  />
                </div>
              </ResourceFormSection>
            ))
          ) : (
            <ResourceFormSection surface="bare">
              <FormReadValue>{t('table.noEquipment')}</FormReadValue>
            </ResourceFormSection>
          )}
        </div>
      </ReadFrame>
      <section className="scroll-mt-24 md:scroll-mt-5" id="documents" tabIndex={-1}>
        <DocumentCollection title={t('detail.documents.title')}>
          <ReadDocuments
            collectionId="billing-quotation"
            files={record.quotation.files}
            referenceNumber={record.quotation.referenceNumber}
            title={t('detail.documents.quotation')}
          />
          <ReadDocuments
            collectionId="billing-purchase-order"
            files={record.purchaseOrder.files}
            referenceNumber={record.purchaseOrder.referenceNumber}
            title={t('detail.documents.purchaseOrder')}
          />
          <ReadDocuments
            collectionId="billing-other-files"
            files={record.otherFiles}
            title={t('detail.documents.otherFiles')}
          />
        </DocumentCollection>
      </section>
    </>
  );
}
