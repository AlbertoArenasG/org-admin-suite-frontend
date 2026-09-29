'use client';

import { FormField, FormReadValue, type FormFieldOrientation } from '@/components/forms';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { Separator } from '@/components/ui/separator';
import { FieldGroup } from '@/components/ui/field';
import type { ServicePackageRecordDetail } from '@/features/servicePackagesRecords';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type ServicePackageRecordGeneralDetailsSectionProps = {
  record: ServicePackageRecordDetail;
};

export function ServicePackageRecordGeneralDetailsSection({
  record,
}: ServicePackageRecordGeneralDetailsSectionProps) {
  const { i18n, t } = useTranslationHydrated('servicePackagesRecords');
  const empty = t('detail.values.empty');
  const booleanValue = (value: boolean) => (value ? t('detail.values.yes') : t('detail.values.no'));

  return (
    <ResourceFormFrame
      contentSurface={{ base: 'bare', md: 'inset' }}
      density={{ base: 'compact', md: 'comfortable' }}
      dividers="hidden"
      headerDensity="compact"
      mode="read"
      surface={{ base: 'bare', md: 'card' }}
      title={t('detail.general.title')}
    >
      <ResourceFormSection surface="bare" title={t('detail.general.contact')}>
        <FieldGroup>
          <ReadField
            label={t('detail.fields.company')}
            orientation="responsive"
            value={record.company}
          />
          <ReadField
            label={t('detail.fields.contactPerson')}
            orientation="responsive"
            value={record.contactPerson}
          />
          <ReadField
            label={t('detail.fields.email')}
            orientation="responsive"
            value={record.email}
          />
          <ReadField
            label={t('detail.fields.phone')}
            orientation="responsive"
            value={record.phone}
          />
          <ReadField
            label={t('detail.fields.address')}
            orientation="responsive"
            value={record.address}
          />
        </FieldGroup>
      </ResourceFormSection>
      <Separator />
      <ResourceFormSection surface="bare" title={t('detail.general.serviceAndMetadata')}>
        <div className="grid gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-7">
          <ReadField label={t('detail.fields.serviceOrder')} value={record.serviceOrder || empty} />
          <ReadField label={t('detail.fields.packageId')} value={record.packageId || empty} />
          <ReadField label={t('detail.fields.originalFilename')} value={record.originalFilename} />
          <ReadField label={t('detail.fields.s3FolderKey')} value={record.s3FolderKey || empty} />
          <ReadField
            label={t('detail.fields.visitDate')}
            value={formatDate(record.visitDate, i18n.language, empty)}
          />
          <ReadField label={t('detail.fields.serviceTime')} value={record.details.serviceTime} />
          <ReadField label={t('detail.fields.serviceType')} value={record.serviceType} />
          <ReadField label={t('detail.fields.purpose')} value={record.purpose} />
          <ReadField label={t('detail.fields.status')} value={record.status || empty} />
          <ReadField
            label={t('detail.fields.createdAt')}
            value={formatDateTime(record.createdAt, i18n.language, empty)}
          />
          <ReadField
            label={t('detail.fields.updatedAt')}
            value={formatDateTime(record.updatedAt, i18n.language, empty)}
          />
        </div>
      </ResourceFormSection>
      <Separator />
      <ResourceFormSection surface="bare" title={t('detail.general.signatures')}>
        <FieldGroup>
          <ReadField
            label={t('detail.fields.synced')}
            orientation="responsive"
            value={booleanValue(record.details.synced)}
          />
          <ReadField
            label={t('detail.fields.collectorSignature')}
            orientation="responsive"
            value={booleanValue(record.details.hasCollectorSignature)}
          />
          <ReadField
            label={t('detail.fields.clientSignature')}
            orientation="responsive"
            value={booleanValue(record.details.hasClientSignature)}
          />
        </FieldGroup>
      </ResourceFormSection>
      <Separator />
      <ResourceFormSection surface="bare" title={t('detail.general.observations')}>
        <ReadField label={t('detail.fields.observations')} value={record.details.observations} />
      </ResourceFormSection>
    </ResourceFormFrame>
  );
}

type ServicePackageRecordEquipmentSectionProps = {
  record: ServicePackageRecordDetail;
};

export function ServicePackageRecordEquipmentSection({
  record,
}: ServicePackageRecordEquipmentSectionProps) {
  const { t } = useTranslationHydrated('servicePackagesRecords');
  const empty = t('detail.values.empty');

  return (
    <ResourceFormFrame
      contentSurface={{ base: 'bare', md: 'inset' }}
      density={{ base: 'compact', md: 'comfortable' }}
      dividers="hidden"
      headerDensity="compact"
      mode="read"
      surface={{ base: 'bare', md: 'card' }}
      title={t('detail.equipment.title')}
    >
      <ResourceFormSection surface="bare">
        {record.details.equipment.length ? (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[48rem] text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  {['number', 'equipment', 'brand', 'model', 'identification', 'serialNumber'].map(
                    (field) => (
                      <th
                        className="whitespace-nowrap px-4 py-3 font-medium"
                        key={field}
                        scope="col"
                      >
                        {t(`detail.fields.${field}`)}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {record.details.equipment.map((item, index) => (
                  <tr key={`${item.identification ?? item.serialNumber ?? index}-${index}`}>
                    <td className="px-4 py-3">{item.number ?? empty}</td>
                    <td className="px-4 py-3">{item.equipment ?? empty}</td>
                    <td className="px-4 py-3">{item.brand ?? empty}</td>
                    <td className="px-4 py-3">{item.model ?? empty}</td>
                    <td className="px-4 py-3">{item.identification ?? empty}</td>
                    <td className="px-4 py-3">{item.serialNumber ?? empty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('detail.equipment.empty')}</p>
        )}
      </ResourceFormSection>
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
  value: string | null;
}) {
  return (
    <FormField label={label} orientation={orientation}>
      <FormReadValue>{value?.trim() || '—'}</FormReadValue>
    </FormField>
  );
}

function formatDate(value: string | null, locale: string, empty: string) {
  if (!value) return empty;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return empty;

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
}

function formatDateTime(value: string | null, locale: string, empty: string) {
  if (!value) return empty;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return empty;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
