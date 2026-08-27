'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Loader2, Plus, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CommunicationChannel, RecipientGroupDetail } from '@/features/recipient-groups/types';
import type { ContactDetail, ContactSearchItem, ContactValue } from '@/features/contacts/types';
import {
  buildContactLookupLabel,
  buildRecipientGroupInitialValues,
  type RecipientGroupFormValues,
} from '@/components/recipient-groups/types';
import { ContactForm } from '@/components/contacts/ContactForm';

interface RecipientGroupFormProps {
  mode: 'create' | 'edit';
  recipientGroup?: RecipientGroupDetail | null;
  communicationChannels: CommunicationChannel[];
  searchResults: ContactSearchItem[];
  contactOptions: ContactSearchItem[];
  searchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  searchError: string | null;
  onSearchContacts: (query: string) => void;
  onCreateContactInContext: (values: {
    name: string;
    lastname: string;
    companyNames: string[];
    emails: ContactValue[];
    phones: ContactValue[];
    cellPhones: ContactValue[];
  }) => Promise<ContactDetail | null>;
  onSubmit: (values: {
    name: string;
    description: string | null;
    enabledChannels: string[];
    contactIds: string[];
  }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isCreatingContactInContext?: boolean;
  disableActions?: boolean;
}

export function RecipientGroupForm({
  mode,
  recipientGroup,
  communicationChannels,
  searchResults,
  contactOptions,
  searchStatus,
  searchError,
  onSearchContacts,
  onCreateContactInContext,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isCreatingContactInContext = false,
  disableActions = false,
}: RecipientGroupFormProps) {
  const { t } = useTranslation('recipientGroups');
  const [lookupQuery, setLookupQuery] = useState('');
  const [isCreateContactOpen, setIsCreateContactOpen] = useState(false);
  const searchContactsRef = useRef(onSearchContacts);
  const lastSearchedQueryRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting: isFormSubmitting },
    reset,
  } = useForm<RecipientGroupFormValues>({
    defaultValues: buildRecipientGroupInitialValues(recipientGroup),
  });

  useEffect(() => {
    reset(buildRecipientGroupInitialValues(recipientGroup));
  }, [recipientGroup, reset]);

  const selectedContactIds = watch('contactIds');
  const selectedChannelCodes = watch('enabledChannels');

  useEffect(() => {
    searchContactsRef.current = onSearchContacts;
  }, [onSearchContacts]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const normalized = lookupQuery.trim();

      if (normalized.length < 2) {
        lastSearchedQueryRef.current = null;
        return;
      }

      if (lastSearchedQueryRef.current === normalized) {
        return;
      }

      lastSearchedQueryRef.current = normalized;
      searchContactsRef.current(normalized);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [lookupQuery]);

  const effectiveDisabled = disableActions || isSubmitting || isFormSubmitting;

  const availableResults = useMemo(
    () => searchResults.filter((contact) => !selectedContactIds.includes(contact.contactId)),
    [searchResults, selectedContactIds]
  );

  const selectedLookupItems = useMemo(() => {
    const optionMap = new Map(contactOptions.map((contact) => [contact.contactId, contact]));

    return selectedContactIds
      .map((contactId) => {
        const contactFromOptions = optionMap.get(contactId);
        if (contactFromOptions) {
          return {
            ...contactFromOptions,
            displayLabel: buildContactLookupLabel(contactFromOptions),
          };
        }

        const contactFromDetail =
          recipientGroup?.contacts.find((contact) => contact.contactId === contactId) ?? null;

        if (!contactFromDetail) {
          return null;
        }

        const normalized: ContactSearchItem = {
          contactId: contactFromDetail.contactId,
          isInternalStaff: contactFromDetail.isInternalStaff,
          userId: contactFromDetail.userId,
          fullName: contactFromDetail.fullName,
          companyNames: contactFromDetail.companyNames,
          primaryEmail: contactFromDetail.primaryEmail,
          primaryCellPhone: contactFromDetail.primaryCellPhone,
        };

        return {
          ...normalized,
          displayLabel: buildContactLookupLabel(normalized),
        };
      })
      .filter(Boolean) as Array<ContactSearchItem & { displayLabel: string }>;
  }, [contactOptions, recipientGroup?.contacts, selectedContactIds]);

  const submitHandler = handleSubmit((values) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || null,
      enabledChannels: values.enabledChannels,
      contactIds: values.contactIds,
    });
  });

  return (
    <>
      <form onSubmit={submitHandler} className="flex h-full flex-col gap-6" noValidate>
        <div className="flex flex-col gap-4 p-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient-group-name">{t('form.labels.name')}</Label>
            <Input
              id="recipient-group-name"
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
            <Label htmlFor="recipient-group-description">{t('form.labels.description')}</Label>
            <Textarea
              id="recipient-group-description"
              placeholder={t('form.placeholders.description')}
              disabled={disableActions}
              {...register('description')}
            />
          </div>

          <div className="grid gap-2">
            <Label>{t('form.labels.enabledChannels')}</Label>
            <div className="grid gap-3">
              {communicationChannels.map((channel) => {
                const isSelected = selectedChannelCodes.includes(channel.code);
                return (
                  <label
                    key={channel.code}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                      isSelected
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border/60 bg-card/40 hover:bg-muted/30'
                    } ${disableActions ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={disableActions}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...selectedChannelCodes, channel.code]
                          : selectedChannelCodes.filter((code) => code !== channel.code);
                        setValue('enabledChannels', Array.from(new Set(next)), {
                          shouldValidate: true,
                        });
                      }}
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{channel.name}</p>
                    </div>
                  </label>
                );
              })}
            </div>
            {selectedChannelCodes.length === 0 ? (
              <p className="text-sm text-destructive">{t('form.errors.channelsRequired')}</p>
            ) : null}
          </div>

          <div className="grid gap-3 rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">{t('form.labels.contacts')}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={disableActions}
                onClick={() => setIsCreateContactOpen(true)}
              >
                <Plus className="size-4" />
                {t('form.actions.createContactInline')}
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recipient-group-contact-search">
                {t('form.labels.contactSearch')}
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="recipient-group-contact-search"
                  value={lookupQuery}
                  disabled={disableActions}
                  onChange={(event) => setLookupQuery(event.target.value)}
                  placeholder={t('form.placeholders.contactSearch')}
                  className="pl-9 pr-9"
                />
                {lookupQuery ? (
                  <button
                    type="button"
                    aria-label={t('actions.clearSearch', { defaultValue: 'Limpiar búsqueda' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    onClick={() => setLookupQuery('')}
                    disabled={disableActions}
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
              {searchError ? <p className="text-sm text-destructive">{searchError}</p> : null}
            </div>

            {lookupQuery.trim().length >= 2 ? (
              <div className="rounded-xl border border-border/60 bg-background/70">
                {searchStatus === 'loading' ? (
                  <div className="px-3 py-4 text-sm text-muted-foreground">
                    {t('form.hints.searchingContacts')}
                  </div>
                ) : availableResults.length ? (
                  <div className="divide-y divide-border/50">
                    {availableResults.map((contact) => (
                      <button
                        key={contact.contactId}
                        type="button"
                        disabled={disableActions}
                        className="flex w-full items-start justify-between gap-3 px-3 py-3 text-left hover:bg-muted/40"
                        onClick={() => {
                          setValue('contactIds', [...selectedContactIds, contact.contactId], {
                            shouldValidate: true,
                          });
                        }}
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{contact.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {buildContactLookupLabel(contact)}
                          </p>
                        </div>
                        <Plus className="mt-0.5 size-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-4 text-sm text-muted-foreground">
                    {t('form.hints.noContactsFound')}
                  </div>
                )}
              </div>
            ) : null}

            <div className="grid gap-2">
              <Label>{t('form.labels.selectedContacts')}</Label>
              {selectedLookupItems.length ? (
                <div className="flex flex-col gap-2">
                  {selectedLookupItems.map((contact) => (
                    <div
                      key={contact.contactId}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/80 px-3 py-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{contact.fullName}</p>
                        <p className="text-xs text-muted-foreground">{contact.displayLabel}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={disableActions}
                        onClick={() => {
                          setValue(
                            'contactIds',
                            selectedContactIds.filter(
                              (contactId) => contactId !== contact.contactId
                            ),
                            { shouldValidate: true }
                          );
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}
              {selectedContactIds.length === 0 ? (
                <p className="text-sm text-destructive">{t('form.errors.contactsRequired')}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-border/50 bg-muted/10 p-4 sm:flex-row sm:justify-end sm:gap-3">
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={effectiveDisabled}>
              {t('form.cancel')}
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={
              effectiveDisabled ||
              selectedContactIds.length === 0 ||
              selectedChannelCodes.length === 0
            }
            className="sm:min-w-[10rem]"
          >
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

      <Dialog open={isCreateContactOpen} onOpenChange={setIsCreateContactOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('form.dialogs.createContact.title')}</DialogTitle>
            <DialogDescription>{t('form.dialogs.createContact.description')}</DialogDescription>
          </DialogHeader>
          <ContactForm
            mode="create"
            isSubmitting={isCreatingContactInContext}
            onCancel={() => setIsCreateContactOpen(false)}
            onSubmit={async (values) => {
              const created = await onCreateContactInContext(values);
              if (!created) {
                return;
              }

              setValue('contactIds', [...selectedContactIds, created.contactId], {
                shouldValidate: true,
              });
              setLookupQuery('');
              setIsCreateContactOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
