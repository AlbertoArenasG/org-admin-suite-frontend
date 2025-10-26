'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  ServiceEntryForm,
  type ServiceEntryFormValues,
} from '@/components/serviceEntries/ServiceEntryForm';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { createServiceEntry } from '@/features/serviceEntries/serviceEntriesThunks';
import { resetServiceEntryForm } from '@/features/serviceEntries/serviceEntriesSlice';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { parseUserRole } from '@/features/users/roles';

export default function ServiceEntryCreatePage() {
  const { t } = useTranslationHydrated('common');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

  const authUser = useAppSelector((state) => state.auth.user);
  const formState = useAppSelector((state) => state.serviceEntries.form);

  const currentRole = authUser ? parseUserRole(authUser.role) : null;
  const canManage = Boolean(currentRole && currentRole !== 'CUSTOMER');

  useEffect(() => {
    return () => {
      dispatch(resetServiceEntryForm());
    };
  }, [dispatch]);

  useEffect(() => {
    if (formState.status === 'succeeded' && formState.lastCreatedId) {
      const targetId = formState.lastCreatedId;
      showSnackbar({
        message:
          formState.error ??
          t('serviceEntries.create.success', {
            defaultValue: 'Servicio registrado correctamente.',
          }),
        severity: 'success',
      });
      dispatch(resetServiceEntryForm());
      router.push(`/dashboard/service-entries/${targetId}`);
    } else if (formState.status === 'failed') {
      showSnackbar({
        message:
          formState.error ??
          t('serviceEntries.create.error', {
            defaultValue: 'No fue posible registrar el servicio.',
          }),
        severity: 'error',
      });
      dispatch(resetServiceEntryForm());
    }
  }, [dispatch, formState, router, showSnackbar, t]);

  const handleSubmit = (values: ServiceEntryFormValues) => {
    if (!canManage || formState.status === 'loading') {
      return;
    }
    void dispatch(
      createServiceEntry({
        companyName: values.companyName,
        contactName: values.contactName,
        contactEmail: values.contactEmail,
        serviceOrderIdentifier: values.serviceOrderIdentifier,
        categoryId: values.categoryId,
        calibrationCertificateFileId: values.calibrationCertificateFileId,
        attachmentFileIds: values.attachmentFileIds,
      })
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs.dashboard'), href: '/dashboard', hideOnDesktop: true },
              { label: t('serviceEntries.breadcrumb'), href: '/dashboard/service-entries' },
              { label: t('serviceEntries.create.title') },
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
          sx={{ px: 4, py: 4, borderBottom: '1px solid var(--surface-border)' }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              {t('serviceEntries.create.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('serviceEntries.create.subtitle', {
                defaultValue: 'Completa la información del servicio.',
              })}
            </Typography>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            {t('common:cancel')}
          </Button>
        </Box>

        {!canManage ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {t('serviceEntries.restricted', {
              defaultValue: 'No cuentas con permisos para gestionar entradas de servicio.',
            })}
          </div>
        ) : null}

        <ServiceEntryForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isSubmitting={formState.status === 'loading'}
          disableActions={!canManage}
        />
      </Paper>
    </div>
  );
}
