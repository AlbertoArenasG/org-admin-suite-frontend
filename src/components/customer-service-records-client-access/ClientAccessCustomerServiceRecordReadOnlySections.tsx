'use client';

import {
  FormField,
  FormIntervalDisplay,
  FormReadValue,
  FormValueChips,
  type FormFieldOrientation,
} from '@/components/forms';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { Separator } from '@/components/ui/separator';
import { FieldGroup } from '@/components/ui/field';
import type {
  ClientAccessAssetDetail,
  ClientAccessCustomerServiceRecordDetail,
} from '@/features/customer-service-records-client-access';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { ClientAccessCustomerServiceRecordAssetDocumentsSection } from './ClientAccessCustomerServiceRecordDocumentsSection';

type ClientAccessCustomerServiceRecordGeneralDetailsSectionProps = {
  record: ClientAccessCustomerServiceRecordDetail;
};

export function ClientAccessCustomerServiceRecordGeneralDetailsSection({
  record,
}: ClientAccessCustomerServiceRecordGeneralDetailsSectionProps) {
  const { t } = useTranslationHydrated('clientAccessServices');

  return (
    <ResourceFormFrame
      contentSurface={{ base: 'bare', md: 'inset' }}
      density={{ base: 'compact', md: 'comfortable' }}
      dividers="hidden"
      headerDensity="compact"
      mode="read"
      surface={{ base: 'bare', md: 'card' }}
      title={t('detail.sections.general')}
    >
      <ResourceFormSection surface="bare">
        <FieldGroup>
          <ReadField
            label={t('detail.fields.serviceType')}
            orientation="responsive"
            value={record.serviceType.name}
          />
          <ReadField
            label={t('detail.fields.operationalStatus')}
            orientation="responsive"
            value={record.operationalStatus.name}
          />
          <ReadField
            label={t('detail.fields.observations')}
            orientation="responsive"
            value={record.observations?.trim() || '—'}
          />
        </FieldGroup>
      </ResourceFormSection>
    </ResourceFormFrame>
  );
}

type ClientAccessCustomerServiceRecordCustomerDeliverySectionProps = {
  record: ClientAccessCustomerServiceRecordDetail;
};

export function ClientAccessCustomerServiceRecordCustomerDeliverySection({
  record,
}: ClientAccessCustomerServiceRecordCustomerDeliverySectionProps) {
  const { t } = useTranslationHydrated('clientAccessServices');
  const intervalLabels = {
    years: t('detail.interval.years'),
    months: t('detail.interval.months'),
    weeks: t('detail.interval.weeks'),
    days: t('detail.interval.days'),
  };

  return (
    <ResourceFormFrame
      contentSurface={{ base: 'bare', md: 'inset' }}
      density={{ base: 'compact', md: 'comfortable' }}
      dividers="hidden"
      headerDensity="compact"
      mode="read"
      surface={{ base: 'bare', md: 'card' }}
      title={t('detail.sections.customerDelivery')}
    >
      <ResourceFormSection surface="bare">
        <FieldGroup>
          <ReadField
            label={t('detail.fields.customer')}
            orientation="responsive"
            value={record.customer.name}
          />
          <FormField label={t('detail.fields.customerUsers')} orientation="responsive">
            <FormReadValue>
              <FormValueChips
                emptyLabel="—"
                items={record.customer.users.map((user) => user.name)}
              />
            </FormReadValue>
          </FormField>
        </FieldGroup>
      </ResourceFormSection>
      <Separator />
      <ResourceFormSection surface="bare">
        <div className="grid gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-7">
          <ReadField
            label={t('detail.fields.receivedAt')}
            value={formatDate(record.customerDelivery.receivedAt)}
          />
          <FormField label={t('detail.fields.estimatedDeliveryInterval')} orientation="vertical">
            <FormReadValue>
              <FormIntervalDisplay
                labels={intervalLabels}
                value={record.customerDelivery.estimatedDeliveryInterval}
              />
            </FormReadValue>
          </FormField>
          <ReadField
            label={t('detail.fields.estimatedDeliveryAt')}
            value={formatDate(record.customerDelivery.estimatedDeliveryAt)}
          />
          <ReadField
            label={t('detail.fields.deliveredToCustomerAt')}
            value={formatDate(record.customerDelivery.deliveredToCustomerAt)}
          />
        </div>
      </ResourceFormSection>
    </ResourceFormFrame>
  );
}

type ClientAccessCustomerServiceRecordEquipmentSectionProps = {
  asset: ClientAccessAssetDetail | null;
};

export function ClientAccessCustomerServiceRecordEquipmentSection({
  asset,
}: ClientAccessCustomerServiceRecordEquipmentSectionProps) {
  const { t } = useTranslationHydrated('clientAccessServices');

  if (!asset) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="font-semibold text-foreground">{t('detail.sections.equipment')}</h2>
        <p className="mt-2">{t('detail.equipment.unavailable')}</p>
      </div>
    );
  }

  return (
    <ResourceFormFrame
      contentSurface={{ base: 'bare', md: 'inset' }}
      density={{ base: 'compact', md: 'comfortable' }}
      dividers="hidden"
      headerDensity="compact"
      mode="read"
      surface={{ base: 'bare', md: 'card' }}
      title={t('detail.sections.equipment')}
    >
      <ResourceFormSection surface="bare" title={t('detail.equipment.detailsTitle')}>
        <div className="grid gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-7">
          <ReadField label={t('detail.fields.assetName')} value={asset.name} />
          <ReadField label={t('detail.fields.identifier')} value={asset.identifier} />
          <ReadField label={t('detail.fields.brand')} value={asset.brand} />
          <ReadField label={t('detail.fields.model')} value={asset.model} />
          <ReadField label={t('detail.fields.serialNumber')} value={asset.serialNumber} />
          <ReadField
            label={t('detail.fields.assetObservations')}
            value={asset.observations?.trim() || '—'}
          />
        </div>
      </ResourceFormSection>
      <Separator />
      <ClientAccessCustomerServiceRecordAssetDocumentsSection asset={asset} />
    </ResourceFormFrame>
  );
}

function ReadField({
  label,
  orientation = 'vertical',
  value,
}: {
  label: string;
  orientation?: FormFieldOrientation;
  value: string;
}) {
  return (
    <FormField label={label} orientation={orientation}>
      <FormReadValue>{value}</FormReadValue>
    </FormField>
  );
}

function formatDate(value: string | null) {
  if (!value) return '—';

  const [year, month, day] = value.slice(0, 10).split('-');
  return year && month && day ? `${day}/${month}/${year}` : '—';
}
