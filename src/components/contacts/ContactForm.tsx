'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

function valuesToText(values?: ContactValue[]) {
  return values?.map((entry) => entry.value).join('\n') ?? '';
}

function textToValues(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => ({ value: item }));
}

function buildInitialValues(contact?: ContactDetail | null): ContactFormValues {
  return {
    name: contact?.name ?? '',
    lastname: contact?.lastname ?? '',
    companyName: contact?.companyName ?? '',
    emailsText: valuesToText(contact?.emails),
    phonesText: valuesToText(contact?.phones),
    cellPhonesText: valuesToText(contact?.cellPhones),
  };
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    defaultValues: buildInitialValues(contact),
  });

  useEffect(() => {
    reset(buildInitialValues(contact));
  }, [contact, reset]);

  const effectiveDisabled = disableActions || isSubmitting || isFormSubmitting;

  const submitHandler = handleSubmit((values) => {
    const payload = {
      name: values.name.trim(),
      lastname: values.lastname.trim(),
      companyName: values.companyName.trim() || null,
      emails: textToValues(values.emailsText),
      phones: textToValues(values.phonesText),
      cellPhones: textToValues(values.cellPhonesText),
    };

    onSubmit(payload);
  });

  const valuesHelpText = useMemo(
    () => t('form.hints.multilineValues', { defaultValue: 'Agrega un valor por línea.' }),
    [t]
  );

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

        <div className="grid gap-2">
          <Label htmlFor="contact-emails">{t('form.labels.emails')}</Label>
          <Textarea
            id="contact-emails"
            placeholder={t('form.placeholders.emails')}
            disabled={disableActions}
            {...register('emailsText')}
          />
          <p className="text-sm text-muted-foreground">{valuesHelpText}</p>
        </div>

        <div className="grid gap-2 md:grid-cols-2 md:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="contact-phones">{t('form.labels.phones')}</Label>
            <Textarea
              id="contact-phones"
              placeholder={t('form.placeholders.phones')}
              disabled={disableActions}
              {...register('phonesText')}
            />
            <p className="text-sm text-muted-foreground">{valuesHelpText}</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-cell-phones">{t('form.labels.cellPhones')}</Label>
            <Textarea
              id="contact-cell-phones"
              placeholder={t('form.placeholders.cellPhones')}
              disabled={disableActions}
              {...register('cellPhonesText')}
            />
            <p className="text-sm text-muted-foreground">{valuesHelpText}</p>
          </div>
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
