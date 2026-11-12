'use client';

import { Check } from 'lucide-react';
import Image from 'next/image';
import type { UseFormReturn } from 'react-hook-form';

import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import type { ServicePackageRecordDetail } from '@/features/servicePackagesRecords';
import { getServicePackageRecordSignatureAttachments } from '@/features/servicePackagesRecords/servicePackageRecordAttachments';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import type { ServicePackageRecordConversionValues } from './servicePackageRecordConversionSchema';

type Props = {
  form: UseFormReturn<ServicePackageRecordConversionValues>;
  source: ServicePackageRecordDetail;
  index: number;
  disabled: boolean;
};

export function ServicePackageRecordConversionPhotosStep({ form, source, index, disabled }: Props) {
  const { t } = useTranslationHydrated('servicePackagesRecords');
  const selectedIds = form.watch(`records.${index}.photoFileIds`) ?? [];
  const signatures = getServicePackageRecordSignatureAttachments(source.files);
  const signatureIds = new Set([signatures.client?.fileId, signatures.collector?.fileId]);
  const photos = source.files.filter(
    (file) => file.mimeType.startsWith('image/') && !signatureIds.has(file.fileId)
  );

  return (
    <ResourceFormFrame
      title={t('conversion.photosStep', {
        number: index + 1,
        total: source.details.equipment.length,
      })}
      mode="edit"
      surface={{ base: 'card', md: 'card' }}
      contentSurface={{ base: 'inset', md: 'inset' }}
      headerDensity="compact"
    >
      <ResourceFormSection surface="bare">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-medium">{t('conversion.photos')}</h3>
            <p className="text-sm text-muted-foreground">{t('conversion.photosHelp')}</p>
            <p role="status" className="text-sm font-medium text-foreground">
              {t('conversion.photoCount', { count: selectedIds.length })}
            </p>
          </div>
          {photos.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {photos.map((photo) => {
                const selected = selectedIds.includes(photo.fileId);
                return (
                  <button
                    key={photo.fileId}
                    type="button"
                    aria-pressed={selected}
                    aria-label={t('conversion.photoToggle', { name: photo.originalName })}
                    disabled={disabled}
                    onClick={() => {
                      form.setValue(
                        `records.${index}.photoFileIds`,
                        selected
                          ? selectedIds.filter((id) => id !== photo.fileId)
                          : [...selectedIds, photo.fileId],
                        { shouldDirty: true }
                      );
                    }}
                    className={`overflow-hidden rounded-xl border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected ? 'border-primary ring-2 ring-primary/40' : 'border-border hover:border-primary/60'}`}
                  >
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src={photo.previewUrl}
                        alt=""
                        fill
                        unoptimized
                        sizes="(min-width: 1280px) 240px, (min-width: 640px) 50vw, 100vw"
                        className="object-contain"
                      />
                      <span
                        aria-hidden="true"
                        className={`absolute right-2 top-2 flex size-6 items-center justify-center rounded-full border ${selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground'}`}
                      >
                        {selected ? <Check className="size-4" /> : null}
                      </span>
                    </div>
                    <span className="block truncate p-2 text-sm">{photo.originalName}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t('conversion.noPhotos')}</p>
          )}
        </div>
      </ResourceFormSection>
    </ResourceFormFrame>
  );
}
