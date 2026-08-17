'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { ExpirationNotificationPoliciesDeleteDialog } from '@/components/expiration-notification-policies/ExpirationNotificationPoliciesDeleteDialog';
import { formatExpirationNotificationPolicyOffset } from '@/components/expiration-notification-policies/formatExpirationNotificationPolicyOffset';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthorization } from '@/features/auth';
import { resetExpirationNotificationPolicyMutations } from '@/features/expiration-notification-policies/expirationNotificationPoliciesSlice';
import {
  deleteExpirationNotificationPolicy,
  fetchExpirationNotificationPolicyById,
} from '@/features/expiration-notification-policies/expirationNotificationPoliciesThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function ExpirationNotificationPolicyDetailPage() {
  const params = useParams<{ expirationNotificationPolicyId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, hydrated, i18n } = useTranslationHydrated([
    'expirationNotificationPolicies',
    'breadcrumbs',
  ]);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();
  const detailState = useAppSelector((state) => state.expirationNotificationPolicies.detail);
  const mutationsState = useAppSelector((state) => state.expirationNotificationPolicies.mutations);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const policy = useMemo(() => {
    if (
      detailState.item?.expirationNotificationPolicyId === params.expirationNotificationPolicyId
    ) {
      return detailState.item;
    }

    return null;
  }, [detailState.item, params.expirationNotificationPolicyId]);

  useEffect(() => {
    if (!params.expirationNotificationPolicyId || !authHydrated) {
      return;
    }

    void dispatch(
      fetchExpirationNotificationPolicyById({
        expirationNotificationPolicyId: params.expirationNotificationPolicyId,
      })
    );
  }, [authHydrated, dispatch, params.expirationNotificationPolicyId]);

  const canUpdate = hasPermission('EXPIRATION_NOTIFICATION_POLICIES', 'UPDATE');
  const canDelete = hasPermission('EXPIRATION_NOTIFICATION_POLICIES', 'DELETE');

  useEffect(() => {
    return () => {
      dispatch(resetExpirationNotificationPolicyMutations());
    };
  }, [dispatch]);

  useEffect(() => {
    if (
      mutationsState.currentExpirationNotificationPolicyId !== params.expirationNotificationPolicyId
    ) {
      return;
    }

    if (mutationsState.deleteStatus === 'succeeded') {
      showSnackbar({
        message:
          mutationsState.message ??
          t('delete.success', {
            defaultValue: 'Política de notificación por vencimiento eliminada correctamente.',
          }),
        severity: 'success',
      });
      dispatch(resetExpirationNotificationPolicyMutations());
      router.push('/dashboard/expiration-notification-policies');
      return;
    }

    if (mutationsState.deleteStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('delete.error', {
            defaultValue: 'No fue posible eliminar la política de notificación por vencimiento.',
          }),
        severity: 'error',
      });
      dispatch(resetExpirationNotificationPolicyMutations());
    }
  }, [dispatch, mutationsState, params.expirationNotificationPolicyId, router, showSnackbar, t]);

  const dateFormatter = useMemo(() => {
    const fallback = i18n.options.fallbackLng;
    const fallbackLang = Array.isArray(fallback)
      ? fallback[0]
      : typeof fallback === 'string'
        ? fallback
        : 'es';
    const locale = hydrated ? i18n.language : fallbackLang;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  }, [hydrated, i18n.language, i18n.options.fallbackLng]);

  const isLoading =
    (!authHydrated && Boolean(params.expirationNotificationPolicyId)) ||
    (detailState.status === 'loading' &&
      detailState.currentExpirationNotificationPolicyId === params.expirationNotificationPolicyId);
  const loadError =
    authHydrated &&
    detailState.status === 'failed' &&
    detailState.currentExpirationNotificationPolicyId === params.expirationNotificationPolicyId
      ? detailState.error
      : null;

  const detailRows = policy
    ? [
        { label: t('detail.fields.name'), value: policy.name || '—' },
        { label: t('detail.fields.description'), value: policy.description || '—' },
        {
          label: t('detail.fields.status'),
          value: (
            <Chip
              color={policy.statusId === 'ACTIVE' ? 'success' : 'default'}
              variant="outlined"
              size="small"
              label={policy.statusName}
            />
          ),
        },
        {
          label: t('detail.fields.createdAt'),
          value:
            policy.createdAt && !Number.isNaN(new Date(policy.createdAt).getTime())
              ? dateFormatter.format(new Date(policy.createdAt))
              : '—',
        },
        {
          label: t('detail.fields.updatedAt'),
          value:
            policy.updatedAt && !Number.isNaN(new Date(policy.updatedAt).getTime())
              ? dateFormatter.format(new Date(policy.updatedAt))
              : '—',
        },
        {
          label: t('detail.fields.createdBy'),
          value:
            [policy.createdBy?.name, policy.createdBy?.email].filter(Boolean).join(' · ') || '—',
        },
        {
          label: t('detail.fields.updatedBy'),
          value:
            [policy.updatedBy?.name, policy.updatedBy?.email].filter(Boolean).join(' · ') || '—',
        },
      ]
    : [];

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
                label: t('breadcrumbs:expirationNotificationPolicies'),
                href: '/dashboard/expiration-notification-policies',
                hideOnDesktop: true,
              },
              { label: policy?.name ?? t('detail.missingTitle') },
            ]}
          />
        </div>
      </header>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '24px',
          border: '1px solid var(--surface-border)',
          bgcolor: 'var(--surface-bg)',
          color: 'var(--foreground)',
          boxShadow: 'var(--surface-shadow)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '60vh',
        }}
      >
        <Box
          sx={{
            px: { xs: 2.5, md: 4 },
            py: 3,
            borderBottom: '1px solid var(--surface-border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <div className="space-y-1">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-56 rounded-md" />
                <Skeleton className="h-4 w-72 rounded-md" />
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  {policy?.name ?? t('detail.missingTitle')}
                </Typography>
                <Typography variant="body2" color="text.foreground">
                  {t('detail.subtitle')}
                </Typography>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/expiration-notification-policies')}
            >
              {t('detail.actions.back')}
            </Button>
            {canDelete ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={mutationsState.deleteStatus === 'loading'}
              >
                {t('actions.delete')}
              </Button>
            ) : null}
            {canUpdate ? (
              <Button
                size="sm"
                onClick={() =>
                  router.push(
                    `/dashboard/expiration-notification-policies/${params.expirationNotificationPolicyId}/edit`
                  )
                }
              >
                {t('actions.edit')}
              </Button>
            ) : null}
          </div>
        </Box>

        <div className="flex flex-col gap-4 p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-12 text-center text-sm text-destructive">
              {loadError}
            </div>
          ) : policy ? (
            <>
              <div className="grid gap-3">
                {detailRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 px-4 py-3 md:flex-row md:items-center md:justify-between"
                  >
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <span className="text-sm font-medium text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                <div className="mb-4 space-y-1">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {t('detail.rules.title')}
                  </Typography>
                  <Typography variant="body2" color="text.foreground">
                    {t('detail.rules.subtitle')}
                  </Typography>
                </div>

                {policy.rules.length ? (
                  <div className="grid gap-4">
                    {policy.rules.map((rule, index) => (
                      <div
                        key={rule.ruleId}
                        className="rounded-2xl border border-border/60 bg-background/80 p-4"
                      >
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground">
                                {t('detail.rules.ruleLabel', { index: index + 1 })}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Chip size="small" variant="outlined" label={rule.anchor.name} />
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  label={rule.triggerMode.name}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-xl border border-border/60 bg-card/60 px-3 py-3">
                              <p className="text-xs text-muted-foreground">
                                {t('detail.rules.fields.startOffset')}
                              </p>
                              <p className="mt-1 text-sm font-medium text-foreground">
                                {formatExpirationNotificationPolicyOffset(rule.startOffset, t)}
                              </p>
                            </div>

                            <div className="rounded-xl border border-border/60 bg-card/60 px-3 py-3">
                              <p className="text-xs text-muted-foreground">
                                {t('detail.rules.fields.repeatEvery')}
                              </p>
                              <p className="mt-1 text-sm font-medium text-foreground">
                                {formatExpirationNotificationPolicyOffset(rule.repeatEvery, t)}
                              </p>
                            </div>

                            <div className="rounded-xl border border-border/60 bg-card/60 px-3 py-3">
                              <p className="text-xs text-muted-foreground">
                                {t('detail.rules.fields.repeatUntil')}
                              </p>
                              <p className="mt-1 text-sm font-medium text-foreground">
                                {rule.repeatUntil?.name ?? '—'}
                              </p>
                            </div>

                            <div className="rounded-xl border border-border/60 bg-card/60 px-3 py-3">
                              <p className="text-xs text-muted-foreground">
                                {t('detail.rules.fields.repeatFor')}
                              </p>
                              <p className="mt-1 text-sm font-medium text-foreground">
                                {formatExpirationNotificationPolicyOffset(rule.repeatFor, t)}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-xl border border-border/60 bg-card/60 px-3 py-3">
                            <p className="mb-2 text-xs text-muted-foreground">
                              {t('detail.rules.fields.recipientGroups')}
                            </p>
                            {rule.recipientGroups.length ? (
                              <div className="flex flex-wrap gap-2">
                                {rule.recipientGroups.map((recipientGroup) => (
                                  <Chip
                                    key={recipientGroup.recipientGroupId}
                                    size="small"
                                    variant="outlined"
                                    label={recipientGroup.name}
                                  />
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">—</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('detail.rules.empty')}</p>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-12 text-center text-sm text-muted-foreground">
              {t('detail.notFound')}
            </div>
          )}
        </div>
      </Paper>

      <ExpirationNotificationPoliciesDeleteDialog
        open={deleteDialogOpen}
        policy={
          policy
            ? {
                expirationNotificationPolicyId: policy.expirationNotificationPolicyId,
                name: policy.name,
                statusId: policy.statusId,
                statusLabel: policy.statusName,
                rulesCount: policy.rules.length,
                createdAt: policy.createdAt,
                updatedAt: policy.updatedAt,
                source: policy,
              }
            : null
        }
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (!policy || mutationsState.deleteStatus === 'loading') {
            return;
          }

          void dispatch(
            deleteExpirationNotificationPolicy({
              expirationNotificationPolicyId: policy.expirationNotificationPolicyId,
            })
          );
        }}
        isLoading={mutationsState.deleteStatus === 'loading'}
        labels={{
          title: t('confirmDelete.title'),
          description: policy
            ? t('confirmDelete.description', { name: policy.name })
            : t('confirmDelete.description', { name: '—' }),
          warning: t('confirmDelete.warning'),
          cancel: t('confirmDelete.cancel'),
          confirm: t('confirmDelete.confirm'),
        }}
      />
    </div>
  );
}
