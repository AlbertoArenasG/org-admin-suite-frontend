'use client';

import { FormField, FormReadValue } from '@/components/forms';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import type { ServicePackageRecordDetail } from '@/features/servicePackagesRecords';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export function ServicePackageRecordConversionSource({
  source,
  equipmentIndex,
}: {
  source: ServicePackageRecordDetail;
  equipmentIndex: number;
}) {
  const { t } = useTranslationHydrated('servicePackagesRecords');
  const equipment = source.details.equipment[equipmentIndex];
  return (
    <aside className="lg:sticky lg:top-4 lg:self-start" aria-label={t('conversion.sourceTitle')}>
      <ResourceFormFrame
        title={t('conversion.sourceTitle')}
        mode="read"
        surface={{ base: 'card', md: 'card' }}
        contentSurface={{ base: 'inset', md: 'inset' }}
        headerDensity="compact"
      >
        <ResourceFormSection surface="bare">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <FormField label={t('detail.fields.serviceOrder')}>
              <FormReadValue>{source.serviceOrder || '—'}</FormReadValue>
            </FormField>
            <FormField label={t('detail.fields.company')}>
              <FormReadValue>{source.company || '—'}</FormReadValue>
            </FormField>
            <FormField label={t('detail.fields.contactPerson')}>
              <FormReadValue>{source.contactPerson || '—'}</FormReadValue>
            </FormField>
            <FormField label={t('detail.fields.visitDate')}>
              <FormReadValue>{source.visitDate?.slice(0, 10) || '—'}</FormReadValue>
            </FormField>
            <FormField label={t('detail.fields.serviceType')}>
              <FormReadValue>{source.serviceType || '—'}</FormReadValue>
            </FormField>
            {equipment ? (
              <>
                <FormField label={t('conversion.sourceEquipment')}>
                  <FormReadValue>{equipment.equipment || '—'}</FormReadValue>
                </FormField>
                <FormField label={t('detail.fields.identification')}>
                  <FormReadValue>{equipment.identification || '—'}</FormReadValue>
                </FormField>
                <FormField label={t('detail.fields.brand')}>
                  <FormReadValue>{equipment.brand || '—'}</FormReadValue>
                </FormField>
                <FormField label={t('detail.fields.model')}>
                  <FormReadValue>{equipment.model || '—'}</FormReadValue>
                </FormField>
                <FormField label={t('detail.fields.serialNumber')}>
                  <FormReadValue>{equipment.serialNumber || '—'}</FormReadValue>
                </FormField>
              </>
            ) : null}
          </div>
        </ResourceFormSection>
      </ResourceFormFrame>
    </aside>
  );
}
