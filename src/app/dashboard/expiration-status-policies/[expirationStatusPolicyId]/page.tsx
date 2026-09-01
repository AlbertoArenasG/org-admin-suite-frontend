'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { ExpirationStatusPoliciesDeleteDialog } from '@/components/expiration-status-policies/ExpirationStatusPoliciesDeleteDialog';
import { formatExpirationStatusPolicyOffset } from '@/components/expiration-status-policies/formatExpirationStatusPolicyOffset';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthorization } from '@/features/auth';
import { resetExpirationStatusPolicyMutations } from '@/features/expiration-status-policies/expirationStatusPoliciesSlice';
import {
  deleteExpirationStatusPolicy,
  fetchExpirationStatusPolicyById,
} from '@/features/expiration-status-policies/expirationStatusPoliciesThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function ExpirationStatusPolicyDetailPage() {
  const params = useParams<{ expirationStatusPolicyId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, hydrated, i18n } = useTranslationHydrated(['expirationStatusPolicies', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();
  const detailState = useAppSelector((state) => state.expirationStatusPolicies.detail);
  const mutationsState = useAppSelector((state) => state.expirationStatusPolicies.mutations);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const policy = useMemo(() => {
    if (detailState.item?.expirationStatusPolicyId === params.expirationStatusPolicyId) {
      return detailState.item;
    }

    return null;
  }, [detailState.item, params.expirationStatusPolicyId]);

  useEffect(() => {
    if (!params.expirationStatusPolicyId || !authHydrated) {
      return;
    }

    void dispatch(
      fetchExpirationStatusPolicyById({
        expirationStatusPolicyId: params.expirationStatusPolicyId,
      })
    );
  }, [authHydrated, dispatch, params.expirationStatusPolicyId]);

  const canUpdate = hasPermission('EXPIRATION_STATUS_POLICIES', 'UPDATE');
  const canDelete = hasPermission('EXPIRATION_STATUS_POLICIES', 'DELETE');

  useEffect(() => {
    return () => {
      dispatch(resetExpirationStatusPolicyMutations());
    };
  }, [dispatch]);

  useEffect(() => {
    if (mutationsState.currentExpirationStatusPolicyId !== params.expirationStatusPolicyId) {
      return;
    }

    if (mutationsState.deleteStatus === 'succeeded') {
      showSnackbar({
        message:
          mutationsState.message ??
          t('delete.success', {
            defaultValue: 'Política de estatus por vencimiento eliminada correctamente.',
          }),
        severity: 'success',
      });
      dispatch(resetExpirationStatusPolicyMutations());
      router.push('/dashboard/expiration-status-policies');
      return;
    }

    if (mutationsState.deleteStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('delete.error', {
            defaultValue: 'No fue posible eliminar la política de estatus por vencimiento.',
          }),
        severity: 'error',
      });
      dispatch(resetExpirationStatusPolicyMutations());
    }
  }, [dispatch, mutationsState, params.expirationStatusPolicyId, router, showSnackbar, t]);

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
    (!authHydrated && Boolean(params.expirationStatusPolicyId)) ||
    (detailState.status === 'loading' &&
      detailState.currentExpirationStatusPolicyId === params.expirationStatusPolicyId);
  const loadError =
    authHydrated &&
    detailState.status === 'failed' &&
    detailState.currentExpirationStatusPolicyId === params.expirationStatusPolicyId
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
      <DashboardPageHeader
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
          {
            label: t('breadcrumbs:expirationStatusPolicies'),
            href: '/dashboard/expiration-status-policies',
            hideOnDesktop: true,
          },
          { label: policy?.name ?? t('detail.missingTitle') },
        ]}
      />

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
              onClick={() => router.push('/dashboard/expiration-status-policies')}
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
                    `/dashboard/expiration-status-policies/${params.expirationStatusPolicyId}/edit`
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
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">
                              {t('detail.rules.ruleLabel', { index: index + 1 })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatExpirationStatusPolicyOffset(rule.startOffset, t)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block size-4 rounded-full border border-border/60"
                              style={{ backgroundColor: rule.colorHex }}
                            />
                            <Chip size="small" variant="outlined" label={rule.label} />
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

      <ExpirationStatusPoliciesDeleteDialog
        open={deleteDialogOpen}
        policy={
          policy
            ? {
                expirationStatusPolicyId: policy.expirationStatusPolicyId,
                name: policy.name,
                description: policy.description,
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
            deleteExpirationStatusPolicy({
              expirationStatusPolicyId: policy.expirationStatusPolicyId,
            })
          );
        }}
        isLoading={mutationsState.deleteStatus === 'loading'}
        labels={{
          title: t('confirmDelete.title'),
          description: t('confirmDelete.description', {
            name: policy?.name ?? t('detail.missingTitle'),
          }),
          warning: t('confirmDelete.warning'),
          cancel: t('confirmDelete.cancel'),
          confirm: t('confirmDelete.confirm'),
        }}
      />
    </div>
  );
}
