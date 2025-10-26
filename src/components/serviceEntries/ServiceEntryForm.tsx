'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { uploadServiceEntryFiles } from '@/features/serviceEntries/serviceEntriesThunks';
import { FileDrop } from 'react-file-drop';
import { CheckCircle2, UploadCloud, X } from 'lucide-react';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import type { ServiceEntry } from '@/features/serviceEntries/serviceEntriesSlice';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  companyName: z.string().trim().min(1, 'serviceEntries.form.errors.companyName'),
  contactName: z.string().trim().min(1, 'serviceEntries.form.errors.contactName'),
  contactEmail: z.string().trim().email('serviceEntries.form.errors.contactEmail'),
  serviceOrderIdentifier: z.string().trim().min(1, 'serviceEntries.form.errors.serviceOrder'),
  categoryId: z.string().trim().min(1, 'serviceEntries.form.errors.category'),
  calibrationCertificateFileId: z.string().trim().nullable(),
  attachmentFileIds: z.array(z.string().trim()),
});

export type ServiceEntryFormValues = z.infer<typeof formSchema>;

interface ServiceEntryFormDefaultValues extends Partial<ServiceEntryFormValues> {
  filesMetadata?: ServiceEntry['filesMetadata'];
}

interface ServiceEntryFormProps {
  defaultValues?: ServiceEntryFormDefaultValues;
  mode: 'create' | 'edit';
  onSubmit: (values: ServiceEntryFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  disableActions?: boolean;
}

export function ServiceEntryForm({
  defaultValues,
  mode,
  onSubmit,
  onCancel,
  isSubmitting = false,
  disableActions = false,
}: ServiceEntryFormProps) {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const [certificateLabel, setCertificateLabel] = useState('');
  const [attachmentLabels, setAttachmentLabels] = useState<Record<string, string>>({});
  const certificateInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentsInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<ServiceEntryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      contactEmail: '',
      serviceOrderIdentifier: '',
      categoryId: '',
      calibrationCertificateFileId: null,
      attachmentFileIds: [],
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        companyName: defaultValues.companyName ?? '',
        contactName: defaultValues.contactName ?? '',
        contactEmail: defaultValues.contactEmail ?? '',
        serviceOrderIdentifier: defaultValues.serviceOrderIdentifier ?? '',
        categoryId: defaultValues.categoryId ?? '',
        calibrationCertificateFileId: defaultValues.calibrationCertificateFileId ?? null,
        attachmentFileIds: defaultValues.attachmentFileIds ?? [],
      });
    }
  }, [defaultValues, form]);

  useEffect(() => {
    if (defaultValues?.filesMetadata?.calibration_certificate) {
      setCertificateLabel(defaultValues.filesMetadata.calibration_certificate.original_name);
    } else {
      setCertificateLabel('');
    }
    if (defaultValues?.filesMetadata?.attachments) {
      setAttachmentLabels(
        Object.fromEntries(
          defaultValues.filesMetadata.attachments.map((file) => [file.file_id, file.original_name])
        )
      );
    } else {
      setAttachmentLabels({});
    }
  }, [defaultValues]);

  const processCertificateFiles = (files: FileList | null) => {
    if (!files || !files.length) {
      return;
    }
    setUploadingCertificate(true);
    void dispatch(uploadServiceEntryFiles({ files: Array.from(files).slice(0, 1) }))
      .unwrap()
      .then((uploaded) => {
        if (!uploaded.length) {
          return;
        }
        form.setValue('calibrationCertificateFileId', uploaded[0].id, { shouldDirty: true });
        setCertificateLabel(uploaded[0].original_name);
        showSnackbar({
          message: t('serviceEntries.form.uploadSuccess', { defaultValue: 'File uploaded.' }),
          severity: 'success',
        });
      })
      .catch((error: unknown) => {
        const message =
          typeof error === 'string'
            ? error
            : t('serviceEntries.form.uploadError', { defaultValue: 'Upload failed.' });
        showSnackbar({ message, severity: 'error' });
      })
      .finally(() => setUploadingCertificate(false));
  };

  const handleCertificateDrop = (files: FileList | null) => {
    processCertificateFiles(files);
  };

  const handleCertificateInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    processCertificateFiles(event.target.files);
    event.target.value = '';
  };

  const processAttachmentFiles = (files: FileList | null) => {
    if (!files || !files.length) {
      return;
    }
    setUploadingAttachments(true);
    void dispatch(uploadServiceEntryFiles({ files: Array.from(files) }))
      .unwrap()
      .then((uploaded) => {
        if (!uploaded.length) {
          return;
        }
        const ids = form.getValues('attachmentFileIds');
        form.setValue('attachmentFileIds', [...ids, ...uploaded.map((item) => item.id)], {
          shouldDirty: true,
        });
        setAttachmentLabels((prev) => {
          const next = { ...prev };
          uploaded.forEach((item) => {
            next[item.id] = item.original_name;
          });
          return next;
        });
        showSnackbar({
          message: t('serviceEntries.form.uploadSuccess', { defaultValue: 'File uploaded.' }),
          severity: 'success',
        });
      })
      .catch((error: unknown) => {
        const message =
          typeof error === 'string'
            ? error
            : t('serviceEntries.form.uploadError', { defaultValue: 'Upload failed.' });
        showSnackbar({ message, severity: 'error' });
      })
      .finally(() => setUploadingAttachments(false));
  };

  const handleAttachmentsDrop = (files: FileList | null) => {
    processAttachmentFiles(files);
  };

  const handleAttachmentsInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    processAttachmentFiles(event.target.files);
    event.target.value = '';
  };

  const certificateId = form.watch('calibrationCertificateFileId');
  const attachmentIds = form.watch('attachmentFileIds');

  const onSubmitHandler = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      calibrationCertificateFileId: values.calibrationCertificateFileId ?? null,
    });
  });

  const removeAttachment = (fileId: string) => {
    const ids = form.getValues('attachmentFileIds');
    const nextIds = ids.filter((id) => id !== fileId);
    form.setValue('attachmentFileIds', nextIds, { shouldDirty: true });
    setAttachmentLabels((prev) => {
      const next = { ...prev };
      delete next[fileId];
      return next;
    });
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-1 flex-col gap-4 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="service-company">{t('serviceEntries.form.fields.companyName')}</Label>
          <Input id="service-company" {...form.register('companyName')} />
          {form.formState.errors.companyName ? (
            <p className="text-sm text-destructive">
              {t(form.formState.errors.companyName.message ?? '', {
                defaultValue: 'Company name is required.',
              })}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="service-contact">{t('serviceEntries.form.fields.contactName')}</Label>
          <Input id="service-contact" {...form.register('contactName')} />
          {form.formState.errors.contactName ? (
            <p className="text-sm text-destructive">
              {t(form.formState.errors.contactName.message ?? '', {
                defaultValue: 'Contact name is required.',
              })}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="service-email">{t('serviceEntries.form.fields.contactEmail')}</Label>
          <Input id="service-email" type="email" {...form.register('contactEmail')} />
          {form.formState.errors.contactEmail ? (
            <p className="text-sm text-destructive">
              {t(form.formState.errors.contactEmail.message ?? '', {
                defaultValue: 'Enter a valid email.',
              })}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="service-order">{t('serviceEntries.form.fields.serviceOrder')}</Label>
          <Input id="service-order" {...form.register('serviceOrderIdentifier')} />
          {form.formState.errors.serviceOrderIdentifier ? (
            <p className="text-sm text-destructive">
              {t(form.formState.errors.serviceOrderIdentifier.message ?? '', {
                defaultValue: 'Service order is required.',
              })}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="service-category">{t('serviceEntries.form.fields.category')}</Label>
          <Input id="service-category" {...form.register('categoryId')} />
          {form.formState.errors.categoryId ? (
            <p className="text-sm text-destructive">
              {t(form.formState.errors.categoryId.message ?? '', {
                defaultValue: 'Category is required.',
              })}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-dashed border-border/70 bg-muted/10 p-4">
        <Label className="font-medium">
          {t('serviceEntries.form.fields.calibrationCertificate')}
        </Label>
        <div className="relative">
          <FileDrop
            onDrop={handleCertificateDrop}
            onTargetClick={() => certificateInputRef.current?.click()}
            className={cn(
              'rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center transition-colors hover:border-primary/60 hover:bg-primary/10',
              uploadingCertificate && 'pointer-events-none opacity-60'
            )}
          >
            <div className="flex flex-col items-center gap-3">
              <UploadCloud className="size-8 text-primary" />
              <p className="text-sm text-muted-foreground">
                {t('serviceEntries.form.dragCertificate')}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  certificateInputRef.current?.click();
                }}
              >
                {t('serviceEntries.form.actions.selectFile')}
              </Button>
            </div>
          </FileDrop>
          <input
            ref={certificateInputRef}
            type="file"
            className="hidden"
            onChange={handleCertificateInputChange}
          />
          {uploadingCertificate ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-background/90 text-primary">
              <Spinner className="size-6 text-primary" />
              <p className="text-xs font-semibold">
                {t('serviceEntries.form.uploading', { defaultValue: 'Uploading...' })}
              </p>
            </div>
          ) : null}
        </div>
        {certificateId ? (
          <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-sm text-primary">
            <CheckCircle2 className="size-4" />
            <span className="font-medium">{certificateLabel || certificateId}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                form.setValue('calibrationCertificateFileId', null, { shouldDirty: true });
                setCertificateLabel('');
              }}
              disabled={isSubmitting}
            >
              {t('serviceEntries.form.removeFile')}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="space-y-3 rounded-xl border border-dashed border-border/70 bg-muted/10 p-4">
        <Label className="font-medium">{t('serviceEntries.form.fields.attachments')}</Label>
        <div className="relative">
          <FileDrop
            onDrop={handleAttachmentsDrop}
            onTargetClick={() => attachmentsInputRef.current?.click()}
            className={cn(
              'rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center transition-colors hover:border-primary/60 hover:bg-primary/10',
              uploadingAttachments && 'pointer-events-none opacity-60'
            )}
          >
            <div className="flex flex-col items-center gap-3">
              <UploadCloud className="size-8 text-primary" />
              <p className="text-sm text-muted-foreground">
                {t('serviceEntries.form.dragAttachments')}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  attachmentsInputRef.current?.click();
                }}
              >
                {t('serviceEntries.form.actions.selectFiles')}
              </Button>
            </div>
          </FileDrop>
          <input
            ref={attachmentsInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={handleAttachmentsInputChange}
          />
          {uploadingAttachments ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-background/90 text-primary">
              <Spinner className="size-6 text-primary" />
              <p className="text-xs font-semibold">
                {t('serviceEntries.form.uploading', { defaultValue: 'Uploading...' })}
              </p>
            </div>
          ) : null}
        </div>
        {attachmentIds.length ? (
          <div className="flex flex-wrap gap-2">
            {attachmentIds.map((id) => (
              <div
                key={id}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-xs font-medium text-primary"
              >
                <CheckCircle2 className="size-4" />
                <span>{attachmentLabels[id] ?? id}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(id)}
                  className="text-muted-foreground hover:text-destructive"
                  disabled={isSubmitting}
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border/50 pt-4 sm:flex-row sm:justify-end sm:gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting || disableActions}
        >
          {t('serviceEntries.form.actions.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting || disableActions}>
          {isSubmitting
            ? t('serviceEntries.form.actions.processing')
            : mode === 'create'
              ? t('serviceEntries.form.actions.create')
              : t('serviceEntries.form.actions.update')}
        </Button>
      </div>
    </form>
  );
}
