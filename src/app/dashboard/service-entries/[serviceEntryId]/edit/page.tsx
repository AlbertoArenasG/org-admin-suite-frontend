'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  fetchServiceEntryById,
  updateServiceEntry,
  fetchServiceEntryCategories,
} from '@/features/serviceEntries/serviceEntriesThunks';
import {
  resetServiceEntryDetail,
  resetServiceEntryForm,
} from '@/features/serviceEntries/serviceEntriesSlice';
import {
  ServiceEntryForm,
  type ServiceEntryFormValues,
} from '@/components/serviceEntries/ServiceEntryForm';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { useAuthorization } from '@/features/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

export default function ServiceEntryEditPage() {
  const params = useParams<{ serviceEntryId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['serviceEntries', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();

  const detailState = useAppSelector((state) => state.serviceEntries.detail);
  const formState = useAppSelector((state) => state.serviceEntries.form);
  const categoriesState = useAppSelector((state) => state.serviceEntries.categories);
  const { hasPermission } = useAuthorization();

  const canManage = hasPermission('SERVICE_ENTRIES', 'UPDATE');

  const entry =
    detailState.entry && detailState.entry.id === params.serviceEntryId ? detailState.entry : null;

  const isLoadingDetail =
    (!entry && detailState.status === 'idle') || detailState.status === 'loading';
  const loadError = detailState.status === 'failed' ? detailState.error : null;

  useEffect(() => {
    if (!params.serviceEntryId) {
      return;
    }
    void dispatch(fetchServiceEntryById({ id: params.serviceEntryId }));
  }, [dispatch, params.serviceEntryId]);

  useEffect(() => {
    if (categoriesState.status === 'idle') {
      void dispatch(fetchServiceEntryCategories());
    }
  }, [categoriesState.status, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetServiceEntryDetail());
      dispatch(resetServiceEntryForm());
    };
  }, [dispatch]);

  useEffect(() => {
    if (formState.status === 'succeeded' && formState.lastCreatedId) {
      const targetId = formState.lastCreatedId;
      showSnackbar({
        message:
          formState.error ??
          t('edit.success', {
            defaultValue: 'Servicio actualizado correctamente.',
          }),
        severity: 'success',
      });
      dispatch(resetServiceEntryForm());
      router.push(`/dashboard/service-entries/${targetId}`);
    } else if (formState.status === 'failed') {
      showSnackbar({
        message:
          formState.error ??
          t('edit.error', {
            defaultValue: 'No fue posible actualizar el servicio.',
          }),
        severity: 'error',
      });
      dispatch(resetServiceEntryForm());
    }
  }, [dispatch, formState, router, showSnackbar, t]);

  const handleSubmit = (values: ServiceEntryFormValues) => {
    if (!params.serviceEntryId || !canManage || formState.status === 'loading') {
      return;
    }
    void dispatch(
      updateServiceEntry({
        id: params.serviceEntryId,
        data: {
          companyName: values.companyName,
          contactName: values.contactName,
          contactEmail: values.contactEmail,
          serviceOrderIdentifier: values.serviceOrderIdentifier,
          categoryId: values.categoryId,
          calibrationCertificateFileId: values.calibrationCertificateFileId,
          attachmentFileIds: values.attachmentFileIds,
        },
      })
    );
  };

  if (isLoadingDetail) {
    return <ServiceEntryEditSkeleton />;
  }

  if (loadError) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-destructive">
        {loadError}
      </div>
    );
  }

  if (!entry) {
    return null;
  }

  const defaultValues = {
    companyName: entry.companyName,
    contactName: entry.contactName,
    contactEmail: entry.contactEmail,
    serviceOrderIdentifier: entry.serviceOrderIdentifier,
    categoryId: entry.categoryId,
    calibrationCertificateFileId: entry.calibrationCertificateFileId,
    attachmentFileIds: entry.attachmentFileIds,
    filesMetadata: entry.filesMetadata ?? undefined,
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
          { label: t('breadcrumb'), href: '/dashboard/service-entries' },
          {
            label: entry.companyName,
            href: `/dashboard/service-entries/${entry.id}`,
          },
          { label: t('edit.title') },
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
          sx={{ px: 4, py: 4, borderBottom: '1px solid var(--surface-border)' }}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {t('edit.title')} · {entry.companyName}
              </Typography>
              <Typography variant="body2" color="text.foreground">
                {t('edit.subtitle', {
                  defaultValue: 'Actualiza la información del servicio.',
                })}
              </Typography>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              {t('common:done')}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{entry.contactEmail}</span>
            <Chip size="small" variant="outlined" label={entry.statusName} />
          </div>
          {!canManage ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {t('restricted', {
                defaultValue: 'No cuentas con permisos para gestionar entradas de servicio.',
              })}
            </div>
          ) : null}
        </Box>
        {categoriesState.status === 'loading' ? (
          <div className="flex flex-1 items-center justify-center py-10">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : categoriesState.status === 'failed' ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {categoriesState.error ??
              t('form.categoriesError', {
                defaultValue: 'No fue posible obtener las categorías.',
              })}
          </div>
        ) : (
          <ServiceEntryForm
            mode="edit"
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isSubmitting={formState.status === 'loading'}
            disableActions={!canManage}
            categories={categoriesState.items}
          />
        )}
      </Paper>
    </div>
  );
}

function ServiceEntryEditSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <Skeleton className="h-16 rounded-3xl" />
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
        <div className="flex flex-col gap-3 border-b border-border/60 px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-60 rounded-lg" />
              <Skeleton className="h-4 w-40 rounded-lg" />
            </div>
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-xl" />
          ))}
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="flex gap-2 border-t border-border/60 px-6 py-4">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </Paper>
    </div>
  );
}
