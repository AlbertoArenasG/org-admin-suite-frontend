'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { TFunction } from 'i18next';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, Copy, RefreshCw, Trash2 } from 'lucide-react';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { deleteCustomer, fetchCustomerById } from '@/features/customers/customersThunks';
import { resetCustomerDelete, resetCustomerDetail } from '@/features/customers/customersSlice';
import { CustomerDetailSkeleton } from '@/components/customers/CustomerDetailSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCustomerStatusTone } from '@/components/customers/status';
import type { Customer, CustomerContact } from '@/features/customers/customersSlice';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CustomerDetailPage() {
  const params = useParams<{ customerId?: string }>();
  const router = useRouter();
  const { t, hydrated, i18n } = useTranslationHydrated(['customers', 'breadcrumbs']);
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const [copied, setCopied] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const customerId = typeof params?.customerId === 'string' ? params.customerId : undefined;

  const detailState = useAppSelector((state) => state.customers.detail);
  const deleteState = useAppSelector((state) => state.customers.delete);
  const customer = detailState.entry;

  const dateFormatter = useMemo(() => {
    const fallback = i18n.options.fallbackLng;
    const fallbackLang = Array.isArray(fallback)
      ? fallback[0]
      : typeof fallback === 'string'
        ? fallback
        : 'es';
    const locale = hydrated ? i18n.language : fallbackLang;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });
  }, [hydrated, i18n.language, i18n.options.fallbackLng]);

  const formatDate = useCallback(
    (value: string | null) => {
      if (!value) {
        return t('card.notAvailable');
      }
      try {
        return dateFormatter.format(new Date(value));
      } catch {
        return t('card.notAvailable');
      }
    },
    [dateFormatter, t]
  );

  useEffect(() => {
    if (!customerId) {
      return;
    }

    void dispatch(fetchCustomerById({ id: customerId }));

    return () => {
      dispatch(resetCustomerDetail());
      dispatch(resetCustomerDelete());
    };
  }, [customerId, dispatch]);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopyLink = useCallback(() => {
    const link = customer?.publicAccessUrl;
    if (!link) {
      showSnackbar({
        message: t('detail.copy.error'),
        severity: 'error',
      });
      return;
    }

    const copyValue = async () => {
      if (typeof navigator !== 'undefined' && window.isSecureContext && navigator.clipboard) {
        await navigator.clipboard.writeText(link);
        return true;
      }

      try {
        const textarea = document.createElement('textarea');
        textarea.value = link;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      } catch {
        return false;
      }
    };

    void copyValue()
      .then((success) => {
        if (success) {
          setCopied(true);
          showSnackbar({
            message: t('detail.copy.success'),
            severity: 'success',
          });
        } else {
          showSnackbar({
            message: t('detail.copy.error'),
            severity: 'error',
          });
        }
      })
      .catch(() => {
        showSnackbar({
          message: t('detail.copy.error'),
          severity: 'error',
        });
      });
  }, [customer?.publicAccessUrl, showSnackbar, t]);

  const handleRetry = useCallback(() => {
    if (!customerId) {
      return;
    }
    void dispatch(fetchCustomerById({ id: customerId }));
  }, [customerId, dispatch]);

  useEffect(() => {
    if (deleteState.status === 'succeeded' && deleteState.lastDeletedId === customerId) {
      showSnackbar({
        message:
          deleteState.message ??
          t('delete.success', { defaultValue: 'Cliente eliminado correctamente.' }),
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      dispatch(resetCustomerDelete());
      router.replace('/dashboard/customers');
    } else if (deleteState.status === 'failed' && deleteState.error) {
      showSnackbar({
        message: deleteState.error,
        severity: 'error',
      });
      setDeleteDialogOpen(false);
      dispatch(resetCustomerDelete());
    }
  }, [customerId, deleteState, dispatch, router, showSnackbar, t]);

  const handleDelete = useCallback(() => {
    if (!customerId) {
      return;
    }
    void dispatch(deleteCustomer({ id: customerId }));
  }, [customerId, dispatch]);

  const isLoading = detailState.status === 'loading';
  const hasError = detailState.status === 'failed' && Boolean(detailState.error);

  const pageTitle = customer?.companyName ?? t('detail.title');
  const pageSubtitle = customer
    ? t('detail.subtitle', { code: customer.clientCode })
    : t('detail.subtitleFallback');

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              {
                label: t('breadcrumbs:dashboard'),
                href: '/dashboard',
                hideOnDesktop: true,
              },
              {
                label: t('breadcrumbs:customers'),
                href: '/dashboard/customers',
              },
              {
                label: customer?.companyName ?? t('detail.breadcrumb'),
              },
            ]}
          />
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageSubtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {customer ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/customers/${customer.id}/edit`)}
              className="gap-2"
            >
              {t('detail.actions.edit')}
            </Button>
          ) : null}
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={!customer}
          >
            <Trash2 className="size-4" aria-hidden />
            {t('detail.actions.delete')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/customers')}
            className="gap-2"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t('detail.actions.back')}
          </Button>
        </div>
      </div>

      {hasError ? (
        <Alert
          variant="destructive"
          className="rounded-3xl border border-destructive/50 bg-destructive/5"
        >
          <AlertTitle>{t('detail.error.title')}</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-3 text-sm text-destructive">
            {detailState.error ?? t('detail.error.message')}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="size-4" aria-hidden />
                {t('detail.error.retry')}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <CustomerDetailSkeleton />
      ) : customer ? (
        <CustomerDetailContent
          customer={customer}
          formatDate={formatDate}
          copied={copied}
          onCopyLink={handleCopyLink}
          t={t}
        />
      ) : hasError ? null : (
        <div className="rounded-3xl border border-dashed border-border/60 bg-muted/20 px-6 py-12 text-center text-muted-foreground">
          {t('detail.notFound')}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('delete.title')}</DialogTitle>
            <DialogDescription>
              {t('delete.description', {
                name: customer?.companyName ?? customer?.clientCode ?? '—',
              })}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t('delete.warning')}</p>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteState.status === 'loading'}
            >
              {t('delete.cancel')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteState.status === 'loading'}
            >
              {deleteState.status === 'loading' ? t('delete.processing') : t('delete.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface CustomerDetailContentProps {
  customer: Customer;
  formatDate: (value: string | null) => string;
  copied: boolean;
  onCopyLink: () => void;
  t: TFunction;
}

function CustomerDetailContent({
  customer,
  formatDate,
  copied,
  onCopyLink,
  t,
}: CustomerDetailContentProps) {
  const fiscalProfile = customer.fiscalProfile;
  const files = [
    {
      label: t('detail.files.taxCertificate'),
      file: fiscalProfile?.filesMetadata?.taxCertificate ?? null,
    },
    {
      label: t('detail.files.invoiceRequirements'),
      file: fiscalProfile?.filesMetadata?.invoiceRequirements ?? null,
    },
  ];

  const formatAddress = () => {
    if (!fiscalProfile?.address) {
      return t('detail.address.empty');
    }
    const raw = fiscalProfile.address;
    const lineOne = [raw.street, raw.number].filter(Boolean).join(' ').trim();
    const segments = [lineOne, raw.neighborhood, raw.delegation, raw.city, raw.postalCode]
      .filter((segment) => segment && segment.trim().length > 0)
      .map((segment) => segment!.trim());
    return segments.length ? segments.join(', ') : t('detail.address.empty');
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-3xl border border-border/70 bg-card/90 shadow-md">
        <CardHeader className="gap-2">
          <CardDescription className="text-xs uppercase tracking-widest text-muted-foreground">
            {t('detail.sections.general')}
          </CardDescription>
          <CardTitle className="text-2xl">{customer.companyName}</CardTitle>
          <p className="text-sm text-muted-foreground">{customer.clientCode}</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <DetailField label={t('detail.fields.clientCode')} value={customer.clientCode} />
          <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t('detail.fields.status')}
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getCustomerStatusTone(customer.statusId)}`}
            >
              {customer.statusName}
            </span>
          </div>
          <DetailField
            label={t('detail.fields.createdAt')}
            value={formatDate(customer.createdAt)}
          />
          <DetailField
            label={t('detail.fields.updatedAt')}
            value={formatDate(customer.updatedAt)}
          />
          <div className="md:col-span-2">
            <DetailField
              label={t('detail.sections.publicLink')}
              value={
                customer.publicAccessUrl ? (
                  <span className="font-mono text-xs text-foreground">
                    {customer.publicAccessUrl}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{t('detail.publicLink.empty')}</span>
                )
              }
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3 border-t border-border/60 pt-6">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onCopyLink}
            disabled={!customer.publicAccessUrl}
          >
            {copied ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
            {copied ? t('detail.copy.copied') : t('detail.copy.action')}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border border-border/70 bg-card/90 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">{t('detail.sections.fiscalProfile')}</CardTitle>
            <CardDescription>{t('detail.fiscal.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fiscalProfile ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <DetailField
                    label={t('detail.fields.fiscalStatus')}
                    value={fiscalProfile.statusName}
                  />
                  <DetailField
                    label={t('detail.fields.submittedAt')}
                    value={formatDate(fiscalProfile.submittedAt)}
                  />
                  <DetailField
                    label={t('detail.fields.businessName')}
                    value={fiscalProfile.businessName ?? t('card.notAvailable')}
                  />
                  <DetailField
                    label={t('detail.fields.rfc')}
                    value={fiscalProfile.rfc ?? t('card.notAvailable')}
                  />
                  <DetailField
                    label={t('detail.fields.taxRegime')}
                    value={fiscalProfile.taxRegime ?? t('card.notAvailable')}
                  />
                  <DetailField
                    label={t('detail.fields.cfdiUse')}
                    value={fiscalProfile.cfdi?.use ?? t('card.notAvailable')}
                  />
                  <DetailField
                    label={t('detail.fields.paymentMethod')}
                    value={fiscalProfile.cfdi?.paymentMethod ?? t('card.notAvailable')}
                  />
                  <DetailField
                    label={t('detail.fields.paymentForm')}
                    value={fiscalProfile.cfdi?.paymentForm ?? t('card.notAvailable')}
                  />
                </div>
                {fiscalProfile.requirementsNotes ? (
                  <div className="rounded-3xl border border-dashed border-border/60 bg-muted/20 px-4 py-3 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('detail.notes.title')}
                    </p>
                    <p className="mt-1 text-foreground">{fiscalProfile.requirementsNotes}</p>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{t('detail.fiscal.empty')}</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border/70 bg-card/90 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">{t('detail.sections.address')}</CardTitle>
            <CardDescription>{t('detail.address.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailField label={t('detail.fields.address')} value={formatAddress()} />
            <div className="grid gap-4 sm:grid-cols-2">
              <ContactCard
                title={t('detail.contacts.billing')}
                contact={fiscalProfile?.billingContact ?? null}
                labels={{
                  email: t('detail.contacts.email'),
                  phone: t('detail.contacts.phone'),
                  missing: t('detail.contacts.empty'),
                }}
              />
              <ContactCard
                title={t('detail.contacts.accounts')}
                contact={fiscalProfile?.accountsPayableContact ?? null}
                labels={{
                  email: t('detail.contacts.email'),
                  phone: t('detail.contacts.phone'),
                  missing: t('detail.contacts.empty'),
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border border-border/70 bg-card/90 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">{t('detail.sections.files')}</CardTitle>
          <CardDescription>{t('detail.files.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {files.some((entry) => entry.file) ? (
            files.map((entry) =>
              entry.file ? (
                <div
                  key={entry.label}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{entry.label}</p>
                    <p className="text-sm text-muted-foreground">{entry.file.originalName}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={entry.file.downloadUrl} target="_blank" rel="noreferrer">
                      {t('detail.files.download')}
                    </a>
                  </Button>
                </div>
              ) : null
            )
          ) : (
            <p className="text-sm text-muted-foreground">{t('detail.files.empty')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function ContactCard({
  title,
  contact,
  labels,
}: {
  title: string;
  contact: CustomerContact | null;
  labels: {
    email: string;
    phone: string;
    missing: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{contact?.name ?? labels.missing}</p>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex flex-col">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">{labels.email}</dt>
          <dd className="font-medium text-foreground break-all">
            {contact?.email ?? labels.missing}
          </dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">{labels.phone}</dt>
          <dd className="font-medium text-foreground">{contact?.phone ?? labels.missing}</dd>
        </div>
      </dl>
    </div>
  );
}
