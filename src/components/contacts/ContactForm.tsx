'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Loader2, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ContactDetail, ContactValue } from '@/features/contacts/types';
import type { ContactFormMode, ContactFormValues } from '@/components/contacts/types';

interface ContactFormProps {
  mode: ContactFormMode;
  contact?: ContactDetail | null;
  onSubmit: (values: {
    name: string;
    lastname: string;
    companyName: string | null;
    emails: ContactValue[];
    phones: ContactValue[];
    cellPhones: ContactValue[];
  }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  disableActions?: boolean;
}

function buildInitialValues(contact?: ContactDetail | null): ContactFormValues {
  return {
    name: contact?.name ?? '',
    lastname: contact?.lastname ?? '',
    companyName: contact?.companyName ?? '',
    emails: contact?.emails ?? [],
    phones: contact?.phones ?? [],
    cellPhones: contact?.cellPhones ?? [],
  };
}

interface ContactValuesFieldProps {
  id: string;
  label: string;
  placeholder: string;
  addLabel: string;
  emptyLabel: string;
  values: ContactValue[];
  draftValue: string;
  disabled: boolean;
  onDraftChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

function ContactValuesField({
  id,
  label,
  placeholder,
  addLabel,
  emptyLabel,
  values,
  draftValue,
  disabled,
  onDraftChange,
  onAdd,
  onRemove,
}: ContactValuesFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          value={draftValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onAdd();
            }
          }}
        />
        <Button type="button" variant="outline" disabled={disabled} onClick={onAdd}>
          <Plus className="mr-2 size-4" />
          {addLabel}
        </Button>
      </div>

      {values.length ? (
        <div className="flex flex-wrap gap-2">
          {values.map((entry, index) => (
            <div
              key={`${entry.value}-${index}`}
              className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-sm"
            >
              <span>{entry.value}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(index)}
                className="text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`${label}: ${entry.value}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/60 px-3 py-4 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

interface ContactPhoneValuesFieldProps {
  idPrefix: string;
  label: string;
  codeLabel: string;
  numberLabel: string;
  codePlaceholder: string;
  numberPlaceholder: string;
  addLabel: string;
  emptyLabel: string;
  values: ContactValue[];
  draftCountryCode: string;
  draftNumber: string;
  disabled: boolean;
  onCountryCodeChange: (value: string) => void;
  onNumberChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

function ContactPhoneValuesField({
  idPrefix,
  label,
  codeLabel,
  numberLabel,
  codePlaceholder,
  numberPlaceholder,
  addLabel,
  emptyLabel,
  values,
  draftCountryCode,
  draftNumber,
  disabled,
  onCountryCodeChange,
  onNumberChange,
  onAdd,
  onRemove,
}: ContactPhoneValuesFieldProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="grid gap-2 md:grid-cols-[4.75rem_1fr_auto] md:items-end">
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-code`}>{codeLabel}</Label>
          <Input
            id={`${idPrefix}-code`}
            value={draftCountryCode}
            placeholder={codePlaceholder}
            disabled={disabled}
            onChange={(event) => onCountryCodeChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onAdd();
              }
            }}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-number`}>{numberLabel}</Label>
          <Input
            id={`${idPrefix}-number`}
            value={draftNumber}
            placeholder={numberPlaceholder}
            disabled={disabled}
            onChange={(event) => onNumberChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onAdd();
              }
            }}
          />
        </div>
        <Button type="button" variant="outline" disabled={disabled} onClick={onAdd}>
          <Plus className="mr-2 size-4" />
          {addLabel}
        </Button>
      </div>

      {values.length ? (
        <div className="flex flex-wrap gap-2">
          {values.map((entry, index) => (
            <div
              key={`${entry.value}-${index}`}
              className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-sm"
            >
              <span>{entry.value}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(index)}
                className="text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`${label}: ${entry.value}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/60 px-3 py-4 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

export function ContactForm({
  mode,
  contact,
  onSubmit,
  onCancel,
  isSubmitting = false,
  disableActions = false,
}: ContactFormProps) {
  const { t } = useTranslation('contacts');
  const [emailDraft, setEmailDraft] = useState('');
  const [phoneDraft, setPhoneDraft] = useState({ countryCode: '', number: '' });
  const [cellPhoneDraft, setCellPhoneDraft] = useState({ countryCode: '', number: '' });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting: isFormSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    defaultValues: buildInitialValues(contact),
  });

  useEffect(() => {
    reset(buildInitialValues(contact));
  }, [contact, reset]);

  useEffect(() => {
    setEmailDraft('');
    setPhoneDraft({ countryCode: '', number: '' });
    setCellPhoneDraft({ countryCode: '', number: '' });
  }, [contact]);

  const effectiveDisabled = disableActions || isSubmitting || isFormSubmitting;
  const emails = watch('emails');
  const phones = watch('phones');
  const cellPhones = watch('cellPhones');

  const submitHandler = handleSubmit((values) => {
    const payload = {
      name: values.name.trim(),
      lastname: values.lastname.trim(),
      companyName: values.companyName.trim() || null,
      emails: values.emails,
      phones: values.phones,
      cellPhones: values.cellPhones,
    };

    onSubmit(payload);
  });

  const appendValue = (
    field: 'emails' | 'phones' | 'cellPhones',
    rawValue: string,
    resetDraft: () => void
  ) => {
    const normalized = rawValue.trim();
    if (!normalized) {
      return;
    }

    const currentValues = watch(field);
    setValue(field, [...currentValues, { value: normalized }], {
      shouldDirty: true,
      shouldTouch: true,
    });
    resetDraft();
  };

  const appendPhoneValue = (
    field: 'phones' | 'cellPhones',
    draft: { countryCode: string; number: string },
    resetDraft: () => void
  ) => {
    const countryCode = draft.countryCode.trim();
    const number = draft.number.trim();

    if (!countryCode || !number) {
      return;
    }

    const normalized = `${countryCode} ${number}`;
    const currentValues = watch(field);
    setValue(field, [...currentValues, { value: normalized }], {
      shouldDirty: true,
      shouldTouch: true,
    });
    resetDraft();
  };

  const removeValue = (field: 'emails' | 'phones' | 'cellPhones', index: number) => {
    const currentValues = watch(field);
    setValue(
      field,
      currentValues.filter((_, currentIndex) => currentIndex !== index),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    );
  };

  return (
    <form onSubmit={submitHandler} className="flex h-full flex-col gap-6" noValidate>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid gap-2 md:grid-cols-2 md:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="contact-name">{t('form.labels.name')}</Label>
            <Input
              id="contact-name"
              placeholder={t('form.placeholders.name')}
              disabled={disableActions}
              {...register('name', {
                required: t('form.errors.nameRequired'),
                validate: (value) => {
                  if (value.trim().length < 1) {
                    return t('form.errors.nameRequired');
                  }
                  return true;
                },
              })}
            />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-lastname">{t('form.labels.lastname')}</Label>
            <Input
              id="contact-lastname"
              placeholder={t('form.placeholders.lastname')}
              disabled={disableActions}
              {...register('lastname', {
                required: t('form.errors.lastnameRequired'),
                validate: (value) => {
                  if (value.trim().length < 1) {
                    return t('form.errors.lastnameRequired');
                  }
                  return true;
                },
              })}
            />
            {errors.lastname ? (
              <p className="text-sm text-destructive">{errors.lastname.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact-company-name">{t('form.labels.companyName')}</Label>
          <Input
            id="contact-company-name"
            placeholder={t('form.placeholders.companyName')}
            disabled={disableActions}
            {...register('companyName')}
          />
        </div>

        <ContactValuesField
          id="contact-emails"
          label={t('form.labels.emails')}
          placeholder={t('form.placeholders.emails')}
          addLabel={t('form.actions.addEmail')}
          emptyLabel={t('form.hints.noEmails')}
          values={emails}
          draftValue={emailDraft}
          disabled={disableActions}
          onDraftChange={setEmailDraft}
          onAdd={() => appendValue('emails', emailDraft, () => setEmailDraft(''))}
          onRemove={(index) => removeValue('emails', index)}
        />

        <div className="grid gap-2 md:grid-cols-2 md:gap-4">
          <ContactPhoneValuesField
            idPrefix="contact-phones"
            label={t('form.labels.phones')}
            codeLabel={t('form.labels.phoneCode')}
            numberLabel={t('form.labels.phoneNumber')}
            codePlaceholder={t('form.placeholders.phoneCode')}
            numberPlaceholder={t('form.placeholders.phoneNumber')}
            addLabel={t('form.actions.addPhone')}
            emptyLabel={t('form.hints.noPhones')}
            values={phones}
            draftCountryCode={phoneDraft.countryCode}
            draftNumber={phoneDraft.number}
            disabled={disableActions}
            onCountryCodeChange={(value) =>
              setPhoneDraft((current) => ({ ...current, countryCode: value }))
            }
            onNumberChange={(value) => setPhoneDraft((current) => ({ ...current, number: value }))}
            onAdd={() =>
              appendPhoneValue('phones', phoneDraft, () =>
                setPhoneDraft({ countryCode: '', number: '' })
              )
            }
            onRemove={(index) => removeValue('phones', index)}
          />
          <ContactPhoneValuesField
            idPrefix="contact-cell-phones"
            label={t('form.labels.cellPhones')}
            codeLabel={t('form.labels.phoneCode')}
            numberLabel={t('form.labels.phoneNumber')}
            codePlaceholder={t('form.placeholders.phoneCode')}
            numberPlaceholder={t('form.placeholders.phoneNumber')}
            addLabel={t('form.actions.addCellPhone')}
            emptyLabel={t('form.hints.noCellPhones')}
            values={cellPhones}
            draftCountryCode={cellPhoneDraft.countryCode}
            draftNumber={cellPhoneDraft.number}
            disabled={disableActions}
            onCountryCodeChange={(value) =>
              setCellPhoneDraft((current) => ({ ...current, countryCode: value }))
            }
            onNumberChange={(value) =>
              setCellPhoneDraft((current) => ({ ...current, number: value }))
            }
            onAdd={() =>
              appendPhoneValue('cellPhones', cellPhoneDraft, () =>
                setCellPhoneDraft({ countryCode: '', number: '' })
              )
            }
            onRemove={(index) => removeValue('cellPhones', index)}
          />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border/50 bg-muted/10 p-4 sm:flex-row sm:justify-end sm:gap-3">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={effectiveDisabled}>
            {t('form.cancel')}
          </Button>
        ) : null}
        <Button type="submit" disabled={effectiveDisabled} className="sm:min-w-[10rem]">
          {effectiveDisabled && isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('form.submitting')}
            </>
          ) : (
            t(`form.submit.${mode}`)
          )}
        </Button>
      </div>
    </form>
  );
}
