'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentProps, RefObject } from 'react';
import { useForm, type UseFormRegister, type UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { UploadCloud, Loader2 } from 'lucide-react';

import type {
  PublicProviderProfile,
  PublicProviderProfileFormValues,
  PublicProviderProfileSubmissionPayload,
  PublicProviderUploadedFile,
} from '@/features/publicProviderProfile/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePublicProviderProfileStore } from '@/stores/usePublicProviderProfileStore';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { normalizeFilesForUpload } from '@/lib/normalize-files-for-upload';

interface PublicProviderProfileFormProps {
  profile: PublicProviderProfile;
  token: string;
  formatDate: (value: string | null) => string;
}

type UploadField = 'tax' | 'compliance' | 'address' | 'bank' | null;

export function PublicProviderProfileForm({
  profile,
  token,
  formatDate,
}: PublicProviderProfileFormProps) {
  const { t } = useTranslation('publicProviderProfile');
  const submitProfile = usePublicProviderProfileStore((state) => state.submitProfile);
  const uploadingFn = usePublicProviderProfileStore((state) => state.uploadFiles);
  const submitting = usePublicProviderProfileStore((state) => state.submitting);
  const submitError = usePublicProviderProfileStore((state) => state.submitError);
  const { showSnackbar } = useSnackbar();

  const [uploadingField, setUploadingField] = useState<UploadField>(null);
  const [taxFileMeta, setTaxFileMeta] = useState<PublicProviderUploadedFile | null>(() => {
    const meta = profile.fiscalProfile?.filesMetadata?.taxStatusCertificate;
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
  const [complianceFileMeta, setComplianceFileMeta] = useState<PublicProviderUploadedFile | null>(
    () => {
      const meta = profile.fiscalProfile?.filesMetadata?.taxComplianceOpinion;
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
    }
  );
  const [addressProofMeta, setAddressProofMeta] = useState<PublicProviderUploadedFile | null>(
    () => {
      const meta = profile.fiscalProfile?.filesMetadata?.addressProof;
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
    }
  );
  const [bankStatementMeta, setBankStatementMeta] = useState<PublicProviderUploadedFile | null>(
    () => {
      const meta = profile.bankingInfo?.filesMetadata?.bankStatement;
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
    }
  );

  const defaultValues = useMemo<PublicProviderProfileFormValues>(
    () => ({
      contact: {
        name: profile.contact?.name ?? '',
        phone: profile.contact?.phone ?? '',
        email: profile.contact?.email ?? '',
      },
      fiscalProfile: {
        businessName: profile.fiscalProfile?.businessName ?? '',
        rfc: profile.fiscalProfile?.rfc ?? '',
        address: {
          street: profile.fiscalProfile?.address?.street ?? '',
          number: profile.fiscalProfile?.address?.number ?? '',
          neighborhood: profile.fiscalProfile?.address?.neighborhood ?? '',
          city: profile.fiscalProfile?.address?.city ?? '',
          state: profile.fiscalProfile?.address?.state ?? '',
          postalCode: profile.fiscalProfile?.address?.postalCode ?? '',
        },
        billingContact: {
          name: profile.fiscalProfile?.billingContact?.name ?? '',
          phone: profile.fiscalProfile?.billingContact?.phone ?? '',
          email: profile.fiscalProfile?.billingContact?.email ?? '',
        },
        notes: profile.fiscalProfile?.notes ?? '',
        taxStatusCertificateFileId: profile.fiscalProfile?.taxStatusCertificateFileId ?? null,
        taxComplianceOpinionFileId: profile.fiscalProfile?.taxComplianceOpinionFileId ?? null,
        addressProofFileId: profile.fiscalProfile?.addressProofFileId ?? null,
      },
      bankingInfo: {
        beneficiary: profile.bankingInfo?.beneficiary ?? '',
        bank: profile.bankingInfo?.bank ?? '',
        accountNumber: profile.bankingInfo?.accountNumber ?? '',
        clabe: profile.bankingInfo?.clabe ?? '',
        creditGranted: profile.bankingInfo?.creditGranted ?? '',
        notes: profile.bankingInfo?.notes ?? '',
        bankStatementFileId: profile.bankingInfo?.bankStatementFileId ?? null,
      },
    }),
    [profile]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PublicProviderProfileFormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
    const taxMeta = profile.fiscalProfile?.filesMetadata?.taxStatusCertificate;
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
    const complianceMeta = profile.fiscalProfile?.filesMetadata?.taxComplianceOpinion;
    setComplianceFileMeta(
      complianceMeta
        ? {
            id: complianceMeta.fileId,
            originalName: complianceMeta.originalName,
            filename: complianceMeta.originalName,
            mimeType: '',
            downloadUrl: complianceMeta.downloadUrl ?? null,
            size: 0,
          }
        : null
    );
    const addressMeta = profile.fiscalProfile?.filesMetadata?.addressProof;
    setAddressProofMeta(
      addressMeta
        ? {
            id: addressMeta.fileId,
            originalName: addressMeta.originalName,
            filename: addressMeta.originalName,
            mimeType: '',
            downloadUrl: addressMeta.downloadUrl ?? null,
            size: 0,
          }
        : null
    );
    const bankMeta = profile.bankingInfo?.filesMetadata?.bankStatement;
    setBankStatementMeta(
      bankMeta
        ? {
            id: bankMeta.fileId,
            originalName: bankMeta.originalName,
            filename: bankMeta.originalName,
            mimeType: '',
            downloadUrl: bankMeta.downloadUrl ?? null,
            size: 0,
          }
        : null
    );
  }, [profile, reset, defaultValues]);

  const taxFileInputRef = useRef<HTMLInputElement | null>(null);
  const complianceFileInputRef = useRef<HTMLInputElement | null>(null);
  const addressProofInputRef = useRef<HTMLInputElement | null>(null);
  const bankStatementInputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    const payload = mapFormToPayload(values);
    try {
      await submitProfile(token, payload);
      showSnackbar({
        message: t('form.success') ?? 'Información enviada correctamente.',
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

  const handleUpload = async (field: Exclude<UploadField, null>, fileList: FileList | null) => {
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
        setValue('fiscalProfile.taxStatusCertificateFileId', first.id, { shouldDirty: true });
        setTaxFileMeta(first);
      } else if (field === 'compliance') {
        setValue('fiscalProfile.taxComplianceOpinionFileId', first.id, {
          shouldDirty: true,
        });
        setComplianceFileMeta(first);
      } else if (field === 'address') {
        setValue('fiscalProfile.addressProofFileId', first.id, { shouldDirty: true });
        setAddressProofMeta(first);
      } else {
        setValue('bankingInfo.bankStatementFileId', first.id, { shouldDirty: true });
        setBankStatementMeta(first);
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
      if (complianceFileInputRef.current) {
        complianceFileInputRef.current.value = '';
      }
      if (addressProofInputRef.current) {
        addressProofInputRef.current.value = '';
      }
      if (bankStatementInputRef.current) {
        bankStatementInputRef.current.value = '';
      }
    }
  };

  return (
    <section className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm">
      <form onSubmit={onSubmit} className="space-y-6">
        <SectionTitle title={t('form.sections.contact')} />
        <ContactFields
          title={t('form.fields.contact')}
          control={{
            name: 'contact',
            register,
            errors: {
              name: errors.contact?.name?.message,
              phone: errors.contact?.phone?.message,
              email: errors.contact?.email?.message,
            },
            t,
          }}
        />

        <SectionTitle title={t('form.sections.fiscal')} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label={t('form.fields.businessName')}
            registration={register('fiscalProfile.businessName', {
              required: t('form.errors.required') ?? 'Campo requerido',
            })}
            error={errors.fiscalProfile?.businessName?.message}
            placeholder={t('form.placeholders.businessName') ?? ''}
          />
          <TextField
            label={t('form.fields.rfc')}
            registration={register('fiscalProfile.rfc', {
              required: t('form.errors.required') ?? 'Campo requerido',
            })}
            error={errors.fiscalProfile?.rfc?.message}
            placeholder={t('form.placeholders.rfc') ?? ''}
          />
        </div>

        <SectionTitle title={t('form.sections.address')} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label={t('form.fields.street')}
            registration={register('fiscalProfile.address.street', {
              required: t('form.errors.required'),
            })}
            error={errors.fiscalProfile?.address?.street?.message}
            placeholder={t('form.placeholders.street') ?? ''}
          />
          <TextField
            label={t('form.fields.number')}
            registration={register('fiscalProfile.address.number', {
              required: t('form.errors.required'),
            })}
            error={errors.fiscalProfile?.address?.number?.message}
            placeholder={t('form.placeholders.number') ?? ''}
          />
          <TextField
            label={t('form.fields.neighborhood')}
            registration={register('fiscalProfile.address.neighborhood', {
              required: t('form.errors.required'),
            })}
            error={errors.fiscalProfile?.address?.neighborhood?.message}
            placeholder={t('form.placeholders.neighborhood') ?? ''}
          />
          <TextField
            label={t('form.fields.city')}
            registration={register('fiscalProfile.address.city', {
              required: t('form.errors.required'),
            })}
            error={errors.fiscalProfile?.address?.city?.message}
            placeholder={t('form.placeholders.city') ?? ''}
          />
          <TextField
            label={t('form.fields.state')}
            registration={register('fiscalProfile.address.state', {
              required: t('form.errors.required'),
            })}
            error={errors.fiscalProfile?.address?.state?.message}
            placeholder={t('form.placeholders.state') ?? ''}
          />
          <TextField
            label={t('form.fields.postalCode')}
            registration={register('fiscalProfile.address.postalCode', {
              required: t('form.errors.required'),
            })}
            error={errors.fiscalProfile?.address?.postalCode?.message}
            placeholder={t('form.placeholders.postalCode') ?? ''}
          />
        </div>

        <SectionTitle title={t('form.sections.billingContact')} />
        <ContactFields
          title={t('form.fields.billingContact')}
          control={{
            name: 'fiscalProfile.billingContact',
            register,
            errors: {
              name: errors.fiscalProfile?.billingContact?.name?.message,
              phone: errors.fiscalProfile?.billingContact?.phone?.message,
              email: errors.fiscalProfile?.billingContact?.email?.message,
            },
            t,
          }}
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="fiscalNotes">{t('form.fields.fiscalNotes')}</Label>
          <Textarea
            id="fiscalNotes"
            rows={4}
            placeholder={t('form.placeholders.fiscalNotes') ?? ''}
            {...register('fiscalProfile.notes')}
          />
        </div>

        <SectionTitle title={t('form.sections.banking')} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label={t('form.fields.beneficiary')}
            registration={register('bankingInfo.beneficiary', {
              required: t('form.errors.required') ?? 'Campo requerido',
            })}
            error={errors.bankingInfo?.beneficiary?.message}
            placeholder={t('form.placeholders.beneficiary') ?? ''}
          />
          <TextField
            label={t('form.fields.bank')}
            registration={register('bankingInfo.bank', {
              required: t('form.errors.required') ?? 'Campo requerido',
            })}
            error={errors.bankingInfo?.bank?.message}
            placeholder={t('form.placeholders.bank') ?? ''}
          />
          <TextField
            label={t('form.fields.accountNumber')}
            registration={register('bankingInfo.accountNumber', {
              required: t('form.errors.required') ?? 'Campo requerido',
            })}
            error={errors.bankingInfo?.accountNumber?.message}
            placeholder={t('form.placeholders.accountNumber') ?? ''}
          />
          <TextField
            label={t('form.fields.clabe')}
            registration={register('bankingInfo.clabe', {
              required: t('form.errors.required') ?? 'Campo requerido',
            })}
            error={errors.bankingInfo?.clabe?.message}
            placeholder={t('form.placeholders.clabe') ?? ''}
          />
          <TextField
            label={t('form.fields.creditGranted')}
            registration={register('bankingInfo.creditGranted', {
              required: t('form.errors.required') ?? 'Campo requerido',
            })}
            error={errors.bankingInfo?.creditGranted?.message}
            placeholder={t('form.placeholders.creditGranted') ?? ''}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="bankingNotes">{t('form.fields.bankingNotes')}</Label>
          <Textarea
            id="bankingNotes"
            rows={4}
            placeholder={t('form.placeholders.bankingNotes') ?? ''}
            {...register('bankingInfo.notes')}
          />
        </div>

        <SectionTitle title={t('form.sections.files')} />
        <div className="grid gap-4 md:grid-cols-2">
          <FileUploadField
            label={t('form.fields.taxStatusCertificate')}
            description={taxFileMeta?.originalName ?? t('form.files.empty')}
            downloadingUrl={taxFileMeta?.downloadUrl}
            isUploading={uploadingField === 'tax'}
            onUpload={(files) => handleUpload('tax', files)}
            inputRef={taxFileInputRef}
            uploadLabel={t('form.files.upload')}
            uploadingLabel={t('form.files.uploading')}
          />
          <FileUploadField
            label={t('form.fields.taxComplianceOpinion')}
            description={complianceFileMeta?.originalName ?? t('form.files.empty')}
            downloadingUrl={complianceFileMeta?.downloadUrl}
            isUploading={uploadingField === 'compliance'}
            onUpload={(files) => handleUpload('compliance', files)}
            inputRef={complianceFileInputRef}
            uploadLabel={t('form.files.upload')}
            uploadingLabel={t('form.files.uploading')}
          />
          <FileUploadField
            label={t('form.fields.addressProof')}
            description={addressProofMeta?.originalName ?? t('form.files.empty')}
            downloadingUrl={addressProofMeta?.downloadUrl}
            isUploading={uploadingField === 'address'}
            onUpload={(files) => handleUpload('address', files)}
            inputRef={addressProofInputRef}
            uploadLabel={t('form.files.upload')}
            uploadingLabel={t('form.files.uploading')}
          />
          <FileUploadField
            label={t('form.fields.bankStatement')}
            description={bankStatementMeta?.originalName ?? t('form.files.empty')}
            downloadingUrl={bankStatementMeta?.downloadUrl}
            isUploading={uploadingField === 'bank'}
            onUpload={(files) => handleUpload('bank', files)}
            inputRef={bankStatementInputRef}
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
    name: 'contact' | 'fiscalProfile.billingContact';
    register: UseFormRegister<PublicProviderProfileFormValues>;
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
  values: PublicProviderProfileFormValues
): PublicProviderProfileSubmissionPayload {
  return {
    contact: {
      name: values.contact.name || null,
      phone: values.contact.phone || null,
      email: values.contact.email || null,
    },
    fiscal_profile: {
      business_name: values.fiscalProfile.businessName,
      rfc: values.fiscalProfile.rfc,
      address: {
        street: values.fiscalProfile.address.street,
        number: values.fiscalProfile.address.number,
        neighborhood: values.fiscalProfile.address.neighborhood,
        city: values.fiscalProfile.address.city,
        state: values.fiscalProfile.address.state,
        postal_code: values.fiscalProfile.address.postalCode,
      },
      billing_contact: {
        name: values.fiscalProfile.billingContact.name || null,
        phone: values.fiscalProfile.billingContact.phone || null,
        email: values.fiscalProfile.billingContact.email || null,
      },
      notes: values.fiscalProfile.notes,
      tax_status_certificate_file_id: values.fiscalProfile.taxStatusCertificateFileId,
      tax_compliance_opinion_file_id: values.fiscalProfile.taxComplianceOpinionFileId,
      address_proof_file_id: values.fiscalProfile.addressProofFileId,
    },
    banking_info: {
      beneficiary: values.bankingInfo.beneficiary,
      bank: values.bankingInfo.bank,
      account_number: values.bankingInfo.accountNumber,
      clabe: values.bankingInfo.clabe,
      credit_granted: values.bankingInfo.creditGranted,
      notes: values.bankingInfo.notes,
      bank_statement_file_id: values.bankingInfo.bankStatementFileId,
    },
  };
}
