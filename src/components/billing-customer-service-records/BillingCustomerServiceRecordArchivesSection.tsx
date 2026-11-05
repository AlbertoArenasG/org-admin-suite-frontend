'use client';

import { useEffect, useState } from 'react';
import { FormIntervalDisplay, FormReadValue } from '@/components/forms';
import { BillingReadDocuments } from './BillingCustomerServiceRecordReadOnlySections';
import { DocumentCollectionList } from '@/components/documents/DocumentCollection';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  archiveBillingInvoice,
  clearArchiveSelection,
  fetchBillingInvoiceArchiveDetail,
  fetchBillingInvoiceArchives,
  type BillingCustomerServiceRecord,
} from '@/features/billing-customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type Props = { canUpdate: boolean; record: BillingCustomerServiceRecord };

export function BillingCustomerServiceRecordArchivesSection({ canUpdate, record }: Props) {
  const { t, i18n } = useTranslationHydrated('billingCustomerServiceRecords');
  const dispatch = useAppDispatch();
  const archives = useAppSelector((state) => state.billingCustomerServiceRecords.archives);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recordId = record.customerServiceRecordId;

  useEffect(() => {
    void dispatch(fetchBillingInvoiceArchives({ recordId }));
  }, [dispatch, recordId]);
  const hasCurrentInvoice = Boolean(
    record.invoice.referenceNumber ||
      record.invoice.files.length ||
      record.invoice.paymentComplements.length ||
      record.billing?.issuedAt ||
      record.billing?.deliveredAt ||
      record.billing?.paymentTerm ||
      record.billing?.estimatedPaymentAt ||
      record.billing?.paidAt ||
      (record.billing?.invoiceStatus?.code && record.billing.invoiceStatus.code !== 'PENDING')
  );

  const archive = async () => {
    setPending(true);
    setError(null);
    try {
      await dispatch(archiveBillingInvoice({ recordId })).unwrap();
      setConfirmOpen(false);
      void dispatch(fetchBillingInvoiceArchives({ recordId, page: 1 }));
    } catch (reason) {
      setError(
        typeof reason === 'object' && reason !== null && 'message' in reason
          ? String(reason.message)
          : t('archives.error')
      );
    } finally {
      setPending(false);
    }
  };

  const selected = archives.recordId === recordId ? archives.selected : null;
  const date = (value: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value)
    );
  const localDate = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeZone: 'UTC' }).format(
          new Date(`${value}T12:00:00Z`)
        )
      : '—';

  return (
    <section id="billing-archives" tabIndex={-1} className="scroll-mt-24 md:scroll-mt-5">
      <ResourceFormFrame
        title={t('archives.title')}
        mode="read"
        headerDensity="compact"
        surface={{ base: 'bare', md: 'card' }}
        contentSurface={{ base: 'bare', md: 'inset' }}
        density={{ base: 'compact', md: 'comfortable' }}
        dividers="hidden"
        headerActions={
          canUpdate && hasCurrentInvoice ? (
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => {
                setError(null);
                setConfirmOpen(true);
              }}
            >
              {t('archives.archive')}
            </Button>
          ) : null
        }
      >
        <ResourceFormSection surface="bare">
          {archives.status === 'loading' && archives.recordId === recordId ? (
            <p className="text-sm text-muted-foreground">{t('archives.loading')}</p>
          ) : null}
          {archives.status === 'failed' && archives.recordId === recordId ? (
            <div role="alert" className="space-y-2 text-sm text-destructive">
              <p>{archives.error ?? t('archives.error')}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  void dispatch(fetchBillingInvoiceArchives({ recordId, page: archives.page }))
                }
              >
                {t('actions.retry')}
              </Button>
            </div>
          ) : null}
          {archives.status === 'succeeded' &&
          archives.recordId === recordId &&
          archives.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('archives.empty')}</p>
          ) : null}
          {archives.recordId === recordId && archives.items.length ? (
            <div className="space-y-2">
              {archives.items.map((item) => (
                <div
                  key={item.archiveId}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {t('archives.revision', { number: item.invoiceRevision })} ·{' '}
                      {item.referenceNumber || '—'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {date(item.archivedAt)} · {item.invoiceStatus?.name ?? '—'} ·{' '}
                      {item.archivedBy}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() =>
                      void dispatch(
                        fetchBillingInvoiceArchiveDetail({ recordId, archiveId: item.archiveId })
                      )
                    }
                  >
                    {t('archives.view')}
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={archives.page <= 1 || archives.status === 'loading'}
                  onClick={() =>
                    void dispatch(
                      fetchBillingInvoiceArchives({ recordId, page: archives.page - 1 })
                    )
                  }
                >
                  {t('archives.previous')}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {archives.page} / {archives.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={archives.page >= archives.totalPages || archives.status === 'loading'}
                  onClick={() =>
                    void dispatch(
                      fetchBillingInvoiceArchives({ recordId, page: archives.page + 1 })
                    )
                  }
                >
                  {t('archives.next')}
                </Button>
              </div>
            </div>
          ) : null}
        </ResourceFormSection>
      </ResourceFormFrame>
      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!pending) setConfirmOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('archives.confirmTitle')}</DialogTitle>
            <DialogDescription>{t('archives.confirmDescription')}</DialogDescription>
          </DialogHeader>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <DialogFooter>
            <Button variant="outline" disabled={pending} onClick={() => setConfirmOpen(false)}>
              {t('lifecycle.cancel')}
            </Button>
            <Button loading={pending} onClick={() => void archive()}>
              {t('archives.archive')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={
          Boolean(selected) ||
          archives.detailStatus === 'loading' ||
          archives.detailStatus === 'failed'
        }
        onOpenChange={(open) => {
          if (!open) dispatch(clearArchiveSelection());
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('archives.revision', { number: selected.invoiceRevision })
                : t('archives.loading')}
            </DialogTitle>
            <DialogDescription>
              {selected
                ? `${date(selected.archivedAt)} · ${selected.invoiceStatus?.name ?? '—'}`
                : t('archives.loading')}
            </DialogDescription>
          </DialogHeader>
          {archives.detailStatus === 'failed' ? (
            <p role="alert" className="text-sm text-destructive">
              {archives.error ?? t('archives.error')}
            </p>
          ) : null}
          {selected ? (
            <div className="space-y-4">
              <dl className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ['issuedAt', 'issuedAt'],
                    ['deliveredAt', 'deliveredAt'],
                    ['estimatedPaymentAt', 'estimatedPaymentAt'],
                    ['paidAt', 'paidAt'],
                  ] as const
                ).map(([field, label]) => (
                  <div key={field}>
                    <dt className="text-sm font-medium text-muted-foreground">
                      {t(`lifecycle.${label}`)}
                    </dt>
                    <dd>
                      <FormReadValue>{localDate(selected.billing[field])}</FormReadValue>
                    </dd>
                  </div>
                ))}
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t('lifecycle.paymentTerm')}
                  </dt>
                  <dd>
                    <FormReadValue>
                      {selected.billing.paymentTerm ? (
                        <FormIntervalDisplay
                          value={selected.billing.paymentTerm}
                          labels={{
                            years: t('lifecycle.years'),
                            months: t('lifecycle.months'),
                            weeks: t('lifecycle.weeks'),
                            days: t('lifecycle.days'),
                          }}
                        />
                      ) : (
                        '—'
                      )}
                    </FormReadValue>
                  </dd>
                </div>
              </dl>
              <DocumentCollectionList>
                <BillingReadDocuments
                  collectionId={`${selected.archiveId}-invoice`}
                  files={selected.invoice.files}
                  referenceNumber={selected.invoice.referenceNumber}
                  title={t('detail.billing.invoice')}
                />
                {selected.invoice.removedFiles.length ? (
                  <BillingReadDocuments
                    collectionId={`${selected.archiveId}-removed`}
                    files={selected.invoice.removedFiles}
                    title={t('archives.removedFiles')}
                  />
                ) : null}
                {selected.invoice.paymentComplements.map((complement, index) => (
                  <div key={complement.complementId}>
                    <BillingReadDocuments
                      collectionId={`${selected.archiveId}-${complement.complementId}`}
                      files={complement.files}
                      referenceNumber={complement.referenceNumber}
                      title={t('documents.complement', { number: index + 1 })}
                    />
                    {complement.removedFiles.length ? (
                      <BillingReadDocuments
                        collectionId={`${selected.archiveId}-${complement.complementId}-removed`}
                        files={complement.removedFiles}
                        title={t('archives.removedComplementFiles', { number: index + 1 })}
                      />
                    ) : null}
                  </div>
                ))}
              </DocumentCollectionList>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
