'use client';

import { useEffect, useState } from 'react';
import {
  FormDateInput,
  FormField,
  FormIntervalDisplay,
  FormIntervalInput,
  FormReadValue,
} from '@/components/forms';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { Button } from '@/components/ui/button';
import {
  fetchBillingCustomerServiceRecordDetail,
  fetchBillingInvoiceStatusOptions,
  updateBillingInvoiceStatus,
  updateBillingRecordDetails,
  type BillingCustomerServiceRecord,
  type BillingInvoiceStatus,
} from '@/features/billing-customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import type { CustomerServiceRecordInterval } from '@/features/customer-service-records';

type Props = { record: BillingCustomerServiceRecord; canUpdate: boolean };
const emptyTerm: CustomerServiceRecordInterval = { years: 0, months: 0, weeks: 0, days: 0 };
type DateField = 'issuedAt' | 'deliveredAt' | 'estimatedPaymentAt' | 'paidAt';

export function BillingCustomerServiceRecordLifecycleSection({ record, canUpdate }: Props) {
  const { t, i18n } = useTranslationHydrated('billingCustomerServiceRecords');
  const dispatch = useAppDispatch();
  const options = useAppSelector(
    (state) => state.billingCustomerServiceRecords.invoiceStatusOptions
  );
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<Record<DateField, string>>({
    issuedAt: record.billing?.issuedAt ?? '',
    deliveredAt: record.billing?.deliveredAt ?? '',
    estimatedPaymentAt: record.billing?.estimatedPaymentAt ?? '',
    paidAt: record.billing?.paidAt ?? '',
  });
  const [term, setTerm] = useState<CustomerServiceRecordInterval>(
    record.billing?.paymentTerm ?? emptyTerm
  );
  const [status, setStatus] = useState<BillingInvoiceStatus>(
    (record.billing?.invoiceStatus?.code ?? 'PENDING') as BillingInvoiceStatus
  );

  useEffect(() => {
    if (options.status === 'idle') void dispatch(fetchBillingInvoiceStatusOptions());
  }, [dispatch, options.status]);
  const reset = () => {
    setDates({
      issuedAt: record.billing?.issuedAt ?? '',
      deliveredAt: record.billing?.deliveredAt ?? '',
      estimatedPaymentAt: record.billing?.estimatedPaymentAt ?? '',
      paidAt: record.billing?.paidAt ?? '',
    });
    setTerm(record.billing?.paymentTerm ?? emptyTerm);
    setStatus((record.billing?.invoiceStatus?.code ?? 'PENDING') as BillingInvoiceStatus);
    setError(null);
  };
  const save = async () => {
    setPending(true);
    setError(null);
    try {
      const changes: Parameters<typeof updateBillingRecordDetails>[0]['changes'] = {};
      for (const key of ['issuedAt', 'deliveredAt', 'estimatedPaymentAt', 'paidAt'] as const) {
        if (dates[key] !== (record.billing?.[key] ?? '')) changes[key] = dates[key] || null;
      }
      const previousTerm = record.billing?.paymentTerm ?? emptyTerm;
      if (
        Object.keys(term).some(
          (key) =>
            term[key as keyof CustomerServiceRecordInterval] !==
            previousTerm[key as keyof CustomerServiceRecordInterval]
        )
      )
        changes.paymentTerm = Object.values(term).some(Boolean) ? term : null;
      if (Object.keys(changes).length)
        await dispatch(
          updateBillingRecordDetails({ recordId: record.customerServiceRecordId, changes })
        ).unwrap();
      if (status !== record.billing?.invoiceStatus?.code)
        await dispatch(
          updateBillingInvoiceStatus({ recordId: record.customerServiceRecordId, status })
        ).unwrap();
      setEditing(false);
    } catch (reason) {
      setError(
        typeof reason === 'object' && reason !== null && 'message' in reason
          ? String(reason.message)
          : t('lifecycle.saveError')
      );
      // The first PATCH may have succeeded. Re-read before another attempt.
      void dispatch(
        fetchBillingCustomerServiceRecordDetail({ recordId: record.customerServiceRecordId })
      );
    } finally {
      setPending(false);
    }
  };
  const termLabels = {
    years: t('lifecycle.years'),
    months: t('lifecycle.months'),
    weeks: t('lifecycle.weeks'),
    days: t('lifecycle.days'),
  };
  const dateLabels: Record<DateField, string> = {
    issuedAt: t('lifecycle.issuedAt'),
    deliveredAt: t('lifecycle.deliveredAt'),
    estimatedPaymentAt: t('lifecycle.estimatedPaymentAt'),
    paidAt: t('lifecycle.paidAt'),
  };
  const dateValue = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeZone: 'UTC' }).format(
          new Date(`${value}T12:00:00Z`)
        )
      : '—';

  return (
    <section id="billing-lifecycle" tabIndex={-1} className="scroll-mt-24 md:scroll-mt-5">
      <ResourceFormFrame
        title={t('lifecycle.title')}
        mode={editing ? 'edit' : 'read'}
        headerDensity="compact"
        surface={{ base: 'bare', md: 'card' }}
        contentSurface={{ base: 'bare', md: 'inset' }}
        density={{ base: 'compact', md: 'comfortable' }}
        dividers="hidden"
        headerActions={
          canUpdate && !editing ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                reset();
                setEditing(true);
              }}
            >
              {t('lifecycle.edit')}
            </Button>
          ) : null
        }
      >
        <ResourceFormSection surface="bare">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label={t('lifecycle.invoiceStatus')}
              htmlFor={editing ? 'billing-invoice-status' : undefined}
            >
              {editing ? (
                <select
                  id="billing-invoice-status"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as BillingInvoiceStatus)}
                  disabled={pending || options.status !== 'succeeded'}
                >
                  {options.status !== 'succeeded' ? (
                    <option value={status}>{record.billing?.invoiceStatus?.name ?? status}</option>
                  ) : null}
                  {options.items.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              ) : (
                <FormReadValue>{record.billing?.invoiceStatus?.name ?? '—'}</FormReadValue>
              )}
            </FormField>
            {(Object.keys(dateLabels) as DateField[]).map((field) => (
              <FormField
                key={field}
                label={dateLabels[field]}
                htmlFor={editing ? `billing-${field}` : undefined}
              >
                {editing ? (
                  <FormDateInput
                    id={`billing-${field}`}
                    value={dates[field]}
                    onValueChange={(value) =>
                      setDates((current) => ({ ...current, [field]: value }))
                    }
                    allowEmpty
                    disabled={pending}
                    openCalendarLabel={t('lifecycle.openCalendar')}
                    invalidDateMessage={t('lifecycle.invalidDate')}
                  />
                ) : (
                  <FormReadValue>{dateValue(record.billing?.[field] ?? null)}</FormReadValue>
                )}
              </FormField>
            ))}
            <FormField label={t('lifecycle.paymentTerm')}>
              {editing ? (
                <FormIntervalInput
                  idPrefix="billing-term"
                  value={term}
                  onValueChange={setTerm}
                  labels={termLabels}
                  disabled={pending}
                />
              ) : (
                <FormReadValue>
                  {record.billing?.paymentTerm ? (
                    <FormIntervalDisplay value={record.billing.paymentTerm} labels={termLabels} />
                  ) : (
                    '—'
                  )}
                </FormReadValue>
              )}
            </FormField>
          </div>
          {editing && options.status === 'failed' ? (
            <div role="alert" className="mt-3 flex items-center gap-2 text-sm text-destructive">
              <span>{options.error ?? t('lifecycle.optionsError')}</span>
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => void dispatch(fetchBillingInvoiceStatusOptions())}
              >
                {t('actions.retry')}
              </Button>
            </div>
          ) : null}
          {editing ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" loading={pending} onClick={() => void save()}>
                {t('lifecycle.save')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => {
                  reset();
                  setEditing(false);
                }}
              >
                {t('lifecycle.cancel')}
              </Button>
            </div>
          ) : null}
          {error ? (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </ResourceFormSection>
      </ResourceFormFrame>
    </section>
  );
}
