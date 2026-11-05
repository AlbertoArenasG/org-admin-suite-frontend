'use client';

import { useState, type ReactNode } from 'react';

import { DocumentCollectionList } from '@/components/documents/DocumentCollection';
import { DocumentCollectionReadOnlyItem } from '@/components/documents/DocumentCollectionReadOnlyItem';
import { FormField, FormReadValue } from '@/components/forms';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { FieldGroup } from '@/components/ui/field';
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

export function BillingReadDocuments({
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

function formatDate(value: string | null, language: string) {
  return value && !Number.isNaN(new Date(value).getTime())
    ? new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(value)
      )
    : '—';
}

export function BillingCustomerServiceRecordServiceSection({ record }: Props) {
  const { t, i18n } = useTranslationHydrated('billingCustomerServiceRecords');
  return (
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
            value={formatDate(record.requestedAt, i18n.language)}
          />
          <ReadField
            label={t('detail.service.createdAt')}
            value={formatDate(record.createdAt, i18n.language)}
          />
        </div>
      </ResourceFormSection>
    </ReadFrame>
  );
}

export function BillingCustomerServiceRecordReadOnlySections({ record }: Props) {
  const { t, i18n } = useTranslationHydrated('billingCustomerServiceRecords');
  const { t: tRecord } = useTranslationHydrated('customerServiceRecords');
  const asset = record.assets[0];
  const equipmentFields = asset
    ? [
        { label: tRecord('form.labels.assetName'), value: asset.name },
        { label: tRecord('form.labels.identifier'), value: asset.identifier },
        { label: tRecord('form.labels.brand'), value: asset.brand },
        { label: tRecord('form.labels.model'), value: asset.model },
        { label: tRecord('form.labels.serialNumber'), value: asset.serialNumber },
        { label: tRecord('form.labels.assetObservations'), value: asset.observations },
      ]
    : [];
  return (
    <>
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
              value={formatDate(record.customerDelivery.receivedAt, i18n.language)}
            />
            <ReadField
              label={t('detail.customerDelivery.estimatedAt')}
              value={formatDate(record.customerDelivery.estimatedDeliveryAt, i18n.language)}
            />
            <ReadField
              label={t('detail.customerDelivery.deliveredAt')}
              value={formatDate(record.customerDelivery.deliveredToCustomerAt, i18n.language)}
            />
          </div>
        </ResourceFormSection>
      </ReadFrame>
      <ReadFrame id="equipment" title={t('detail.equipment.title')}>
        {asset ? (
          <>
            <ResourceFormSection surface="bare">
              <FieldGroup className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-7">
                {equipmentFields.map(({ label, value }) => (
                  <FormField key={label} label={label} orientation="vertical">
                    <FormReadValue>{value?.trim() || '—'}</FormReadValue>
                  </FormField>
                ))}
              </FieldGroup>
            </ResourceFormSection>
            <DocumentCollectionList className="border-t border-border/70 pt-2">
              <BillingReadDocuments
                collectionId={`${asset.assetId}-intake-condition`}
                files={asset.intakeConditionFiles}
                title={tRecord('detail.equipment.documents.intakeCondition')}
              />
              <BillingReadDocuments
                collectionId={`${asset.assetId}-delivery-condition`}
                files={asset.deliveryConditionFiles}
                title={tRecord('detail.equipment.documents.deliveryCondition')}
              />
              <BillingReadDocuments
                collectionId={`${asset.assetId}-reports`}
                files={asset.reports}
                title={tRecord('detail.equipment.documents.reports')}
              />
            </DocumentCollectionList>
          </>
        ) : (
          <ResourceFormSection surface="bare">
            <FormReadValue>{t('table.noEquipment')}</FormReadValue>
          </ResourceFormSection>
        )}
      </ReadFrame>
    </>
  );
}
