'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentProps, RefObject } from 'react';
import { useForm, type UseFormRegister, type UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { UploadCloud, Loader2 } from 'lucide-react';

import type {
  PublicCustomerProfile,
  PublicCustomerProfileFormValues,
  PublicCustomerProfileSubmissionPayload,
  PublicCustomerUploadedFile,
} from '@/features/publicCustomerProfile/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePublicCustomerProfileStore } from '@/stores/usePublicCustomerProfileStore';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { normalizeFilesForUpload } from '@/lib/normalize-files-for-upload';

interface PublicCustomerProfileFormProps {
  profile: PublicCustomerProfile;
  token: string;
  formatDate: (value: string | null) => string;
}

export function PublicCustomerProfileForm({
  profile,
  token,
  formatDate,
}: PublicCustomerProfileFormProps) {
  const { t } = useTranslation('publicCustomerProfile');
  const submitProfile = usePublicCustomerProfileStore((state) => state.submitProfile);
  const uploadingFn = usePublicCustomerProfileStore((state) => state.uploadFiles);
  const submitting = usePublicCustomerProfileStore((state) => state.submitting);
  const submitError = usePublicCustomerProfileStore((state) => state.submitError);
  const { showSnackbar } = useSnackbar();

  const [uploadingField, setUploadingField] = useState<'tax' | 'invoice' | null>(null);
  const [taxFileMeta, setTaxFileMeta] = useState<PublicCustomerUploadedFile | null>(() => {
    const meta = profile.fiscalProfile?.filesMetadata?.taxCertificate;
    return meta
      ? {
          id: meta.fileId,
          originalName: meta.originalName,
          filename: meta.originalName,
          mimeType: '',
          downloadUrl: meta.downloadUrl ?? null,
          size: 0,
        }
      : null;
  });
  const [invoiceFileMeta, setInvoiceFileMeta] = useState<PublicCustomerUploadedFile | null>(() => {
    const meta = profile.fiscalProfile?.filesMetadata?.invoiceRequirements;
    return meta
      ? {
          id: meta.fileId,
          originalName: meta.originalName,
          filename: meta.originalName,
          mimeType: '',
          downloadUrl: meta.downloadUrl ?? null,
          size: 0,
        }
      : null;
  });

  const defaultValues = useMemo<PublicCustomerProfileFormValues>(
    () => ({
      businessName: profile.fiscalProfile?.businessName ?? '',
      rfc: profile.fiscalProfile?.rfc ?? '',
      taxRegime: profile.fiscalProfile?.taxRegime ?? '',
      address: {
        street: profile.fiscalProfile?.address?.street ?? '',
        number: profile.fiscalProfile?.address?.number ?? '',
        neighborhood: profile.fiscalProfile?.address?.neighborhood ?? '',
        delegation: profile.fiscalProfile?.address?.delegation ?? '',
        city: profile.fiscalProfile?.address?.city ?? '',
        postalCode: profile.fiscalProfile?.address?.postalCode ?? '',
      },
      cfdi: {
        use: profile.fiscalProfile?.cfdi?.use ?? '',
        paymentMethod: profile.fiscalProfile?.cfdi?.paymentMethod ?? '',
        paymentForm: profile.fiscalProfile?.cfdi?.paymentForm ?? '',
      },
      billingContact: {
        name: profile.fiscalProfile?.billingContact?.name ?? '',
        phone: profile.fiscalProfile?.billingContact?.phone ?? '',
        email: profile.fiscalProfile?.billingContact?.email ?? '',
      },
      accountsContact: {
        name: profile.fiscalProfile?.accountsPayableContact?.name ?? '',
        phone: profile.fiscalProfile?.accountsPayableContact?.phone ?? '',
        email: profile.fiscalProfile?.accountsPayableContact?.email ?? '',
      },
      requirementsNotes: profile.fiscalProfile?.requirementsNotes ?? '',
      taxCertificateFileId: profile.fiscalProfile?.taxCertificateFileId ?? null,
      invoiceRequirementsFileId: profile.fiscalProfile?.invoiceRequirementsFileId ?? null,
    }),
    [profile]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PublicCustomerProfileFormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
    const taxMeta = profile.fiscalProfile?.filesMetadata?.taxCertificate;
    setTaxFileMeta(
      taxMeta
        ? {
            id: taxMeta.fileId,
            originalName: taxMeta.originalName,
            filename: taxMeta.originalName,
            mimeType: '',
            downloadUrl: taxMeta.downloadUrl ?? null,
            size: 0,
          }
        : null
    );
    const invoiceMeta = profile.fiscalProfile?.filesMetadata?.invoiceRequirements;
    setInvoiceFileMeta(
      invoiceMeta
        ? {
            id: invoiceMeta.fileId,
            originalName: invoiceMeta.originalName,
            filename: invoiceMeta.originalName,
            mimeType: '',
            downloadUrl: invoiceMeta.downloadUrl ?? null,
            size: 0,
          }
        : null
    );
  }, [profile, reset, defaultValues]);

  const taxFileInputRef = useRef<HTMLInputElement | null>(null);
  const invoiceFileInputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    const payload = mapFormToPayload(values);
    try {
      await submitProfile(token, payload);
      showSnackbar({
        message: t('form.success') ?? 'Información fiscal enviada correctamente.',
        severity: 'success',
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : (t('form.error') ?? 'No fue posible enviar la información.');
      showSnackbar({ message, severity: 'error' });
    }
  });

  const handleUpload = async (field: 'tax' | 'invoice', fileList: FileList | null) => {
    if (!fileList || !fileList.length) {
      return;
    }
    setUploadingField(field);
    try {
      const [file] = await normalizeFilesForUpload(fileList, { limit: 1 });
      if (!file) {
        throw new Error(t('form.uploadError') ?? 'Archivo inválido.');
      }
      const uploaded = await uploadingFn([file]);
      const first = uploaded[0];
      if (!first) {
        throw new Error(t('form.uploadError') ?? 'Sin respuesta del servidor.');
      }
      if (field === 'tax') {
        setValue('taxCertificateFileId', first.id, { shouldDirty: true });
        setTaxFileMeta(first);
      } else {
        setValue('invoiceRequirementsFileId', first.id, { shouldDirty: true });
        setInvoiceFileMeta(first);
      }
      showSnackbar({
        message: t('form.uploadSuccess') ?? 'Archivo subido correctamente.',
        severity: 'success',
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : (t('form.uploadError') ?? 'No fue posible subir el archivo.');
      showSnackbar({ message, severity: 'error' });
    } finally {
      setUploadingField(null);
      if (taxFileInputRef.current) {
        taxFileInputRef.current.value = '';
      }
      if (invoiceFileInputRef.current) {
        invoiceFileInputRef.current.value = '';
      }
    }
  };

  return (
    <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            label={t('form.fields.businessName')}
            registration={register('businessName', {
              required: t('form.errors.required') ?? 'Campo requerido',
            })}
            error={errors.businessName?.message}
            placeholder={t('form.placeholders.businessName') ?? ''}
          />
          <TextField
            label={t('form.fields.rfc')}
            registration={register('rfc', {
              required: t('form.errors.required') ?? 'Campo requerido',
            })}
            error={errors.rfc?.message}
            placeholder={t('form.placeholders.rfc') ?? ''}
          />
          <TextField
            label={t('form.fields.taxRegime')}
            registration={register('taxRegime', {
              required: t('form.errors.required') ?? 'Campo requerido',
            })}
            error={errors.taxRegime?.message}
            placeholder={t('form.placeholders.taxRegime') ?? ''}
          />
        </div>

        <SectionTitle title={t('form.sections.address')} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label={t('form.fields.street')}
            registration={register('address.street', {
              required: t('form.errors.required'),
            })}
            error={errors.address?.street?.message}
            placeholder={t('form.placeholders.street') ?? ''}
          />
          <TextField
            label={t('form.fields.number')}
            registration={register('address.number', {
              required: t('form.errors.required'),
            })}
            error={errors.address?.number?.message}
            placeholder={t('form.placeholders.number') ?? ''}
          />
          <TextField
            label={t('form.fields.neighborhood')}
            registration={register('address.neighborhood', {
              required: t('form.errors.required'),
            })}
            error={errors.address?.neighborhood?.message}
            placeholder={t('form.placeholders.neighborhood') ?? ''}
          />
          <TextField
            label={t('form.fields.delegation')}
            registration={register('address.delegation', {
              required: t('form.errors.required'),
            })}
            error={errors.address?.delegation?.message}
            placeholder={t('form.placeholders.delegation') ?? ''}
          />
          <TextField
            label={t('form.fields.city')}
            registration={register('address.city', {
              required: t('form.errors.required'),
            })}
            error={errors.address?.city?.message}
            placeholder={t('form.placeholders.city') ?? ''}
          />
          <TextField
            label={t('form.fields.postalCode')}
            registration={register('address.postalCode', {
              required: t('form.errors.required'),
            })}
            error={errors.address?.postalCode?.message}
            placeholder={t('form.placeholders.postalCode') ?? ''}
          />
        </div>

        <SectionTitle title={t('form.sections.cfdi')} />
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            label={t('form.fields.cfdiUse')}
            registration={register('cfdi.use', {
              required: t('form.errors.required'),
            })}
            error={errors.cfdi?.use?.message}
            placeholder={t('form.placeholders.cfdiUse') ?? ''}
          />
          <TextField
            label={t('form.fields.paymentMethod')}
            registration={register('cfdi.paymentMethod', {
              required: t('form.errors.required'),
            })}
            error={errors.cfdi?.paymentMethod?.message}
            placeholder={t('form.placeholders.paymentMethod') ?? ''}
          />
          <TextField
            label={t('form.fields.paymentForm')}
            registration={register('cfdi.paymentForm', {
              required: t('form.errors.required'),
            })}
            error={errors.cfdi?.paymentForm?.message}
            placeholder={t('form.placeholders.paymentForm') ?? ''}
          />
        </div>

        <SectionTitle title={t('form.sections.contacts')} />
        <div className="grid gap-4 md:grid-cols-2">
          <ContactFields
            title={t('form.fields.billingContact')}
            control={{
              name: 'billingContact',
              register,
              errors: {
                name: errors.billingContact?.name?.message,
                phone: errors.billingContact?.phone?.message,
                email: errors.billingContact?.email?.message,
              },
              t,
            }}
          />
          <ContactFields
            title={t('form.fields.accountsContact')}
            control={{
              name: 'accountsContact',
              register,
              errors: {
                name: errors.accountsContact?.name?.message,
                phone: errors.accountsContact?.phone?.message,
                email: errors.accountsContact?.email?.message,
              },
              t,
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="requirementsNotes">{t('form.fields.notes')}</Label>
          <Textarea
            id="requirementsNotes"
            rows={4}
            placeholder={t('form.placeholders.notes') ?? ''}
            {...register('requirementsNotes')}
          />
        </div>

        <SectionTitle title={t('form.sections.files')} />
        <div className="grid gap-4 md:grid-cols-2">
          <FileUploadField
            label={t('form.fields.taxCertificate')}
            description={taxFileMeta?.originalName ?? t('form.files.empty')}
            downloadingUrl={taxFileMeta?.downloadUrl}
            isUploading={uploadingField === 'tax'}
            onUpload={(files) => handleUpload('tax', files)}
            inputRef={taxFileInputRef}
            uploadLabel={t('form.files.upload')}
            uploadingLabel={t('form.files.uploading')}
          />
          <FileUploadField
            label={t('form.fields.invoiceRequirements')}
            description={invoiceFileMeta?.originalName ?? t('form.files.empty')}
            downloadingUrl={invoiceFileMeta?.downloadUrl}
            isUploading={uploadingField === 'invoice'}
            onUpload={(files) => handleUpload('invoice', files)}
            inputRef={invoiceFileInputRef}
            uploadLabel={t('form.files.upload')}
            uploadingLabel={t('form.files.uploading')}
          />
        </div>

        {submitError ? (
          <p className="text-sm text-destructive">{submitError}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t('form.lastUpdated', {
              date: formatDate(profile.updatedAt),
            })}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? t('form.actions.submitting') : t('form.actions.submit')}
          </Button>
        </div>
      </form>
    </section>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-lg font-semibold text-foreground">{title}</h3>;
}

interface TextFieldProps extends ComponentProps<typeof Input> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

function TextField({ label, registration, error, ...props }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input {...registration} {...props} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function ContactFields({
  title,
  control,
}: {
  title: string;
  control: {
    name: 'billingContact' | 'accountsContact';
    register: UseFormRegister<PublicCustomerProfileFormValues>;
    errors?: {
      name?: string;
      phone?: string;
      email?: string;
    };
    t: ReturnType<typeof useTranslation>['t'];
  };
}) {
  const { register, errors, name, t } = control;
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
      <p className="text-sm font-semibold">{title}</p>
      <Input
        placeholder={t('form.placeholders.contactName') ?? ''}
        {...register(`${name}.name`, {
          required: t('form.errors.required') ?? 'Campo requerido',
        })}
      />
      {errors?.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
      <Input
        placeholder={t('form.placeholders.contactEmail') ?? ''}
        {...register(`${name}.email`, {
          required: t('form.errors.required') ?? 'Campo requerido',
        })}
        type="email"
      />
      {errors?.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
      <Input
        placeholder={t('form.placeholders.contactPhone') ?? ''}
        {...register(`${name}.phone`, {
          required: t('form.errors.required') ?? 'Campo requerido',
        })}
      />
      {errors?.phone ? <p className="text-sm text-destructive">{errors.phone}</p> : null}
    </div>
  );
}

interface FileUploadFieldProps {
  label: string;
  description: string;
  downloadingUrl: string | null | undefined;
  isUploading: boolean;
  onUpload: (files: FileList | null) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  uploadLabel: string;
  uploadingLabel: string;
}

function FileUploadField({
  label,
  description,
  downloadingUrl,
  isUploading,
  onUpload,
  inputRef,
  uploadLabel,
  uploadingLabel,
}: FileUploadFieldProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-border/60 bg-background/50 px-4 py-3">
      <Label>{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
      {downloadingUrl ? (
        <a
          href={downloadingUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-primary hover:underline"
        >
          {label}
        </a>
      ) : null}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(event) => onUpload(event.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UploadCloud className="size-4" />
          )}
          {isUploading ? uploadingLabel : uploadLabel}
        </Button>
      </div>
    </div>
  );
}

function mapFormToPayload(
  values: PublicCustomerProfileFormValues
): PublicCustomerProfileSubmissionPayload {
  return {
    business_name: values.businessName,
    rfc: values.rfc,
    tax_regime: values.taxRegime,
    street: values.address.street,
    number: values.address.number,
    neighborhood: values.address.neighborhood,
    delegation: values.address.delegation,
    city: values.address.city,
    postal_code: values.address.postalCode,
    cfdi_use: values.cfdi.use,
    payment_method: values.cfdi.paymentMethod,
    payment_form: values.cfdi.paymentForm,
    billing_contact: {
      name: values.billingContact.name || null,
      phone: values.billingContact.phone || null,
      email: values.billingContact.email || null,
    },
    accounts_payable_contact: {
      name: values.accountsContact.name || null,
      phone: values.accountsContact.phone || null,
      email: values.accountsContact.email || null,
    },
    requirements_notes: values.requirementsNotes,
    tax_certificate_file_id: values.taxCertificateFileId,
    invoice_requirements_file_id: values.invoiceRequirementsFileId || null,
  };
}
