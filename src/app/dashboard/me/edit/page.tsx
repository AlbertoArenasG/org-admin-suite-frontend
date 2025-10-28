'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { MyProfileForm, type MyProfileFormValues } from '@/components/myProfile/MyProfileForm';
import { fetchMyProfile, updateMyProfile } from '@/features/myProfile/myProfileThunks';
import { resetProfileUpdate } from '@/features/myProfile/myProfileSlice';
import { useRouter } from 'next/navigation';
import { FullScreenLoader } from '@/components/ui/full-screen-loader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitialsFromText } from '@/lib/get-initials';

export default function EditMyProfilePage() {
  const { t } = useTranslationHydrated('common');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const profileState = useAppSelector((state) => state.myProfile.profile);
  const updateState = useAppSelector((state) => state.myProfile.update);

  useEffect(() => {
    if (!authHydrated) {
      return;
    }
    if (profileState.status === 'idle') {
      void dispatch(fetchMyProfile());
    }
  }, [authHydrated, dispatch, profileState.status]);

  useEffect(() => {
    if (updateState.status === 'succeeded') {
      showSnackbar({
        message: updateState.message ?? t('myProfile.notifications.updated'),
        severity: 'success',
      });
      dispatch(resetProfileUpdate());
      router.push('/dashboard/me');
    } else if (updateState.status === 'failed' && updateState.error) {
      showSnackbar({
        message: updateState.error,
        severity: 'error',
      });
      dispatch(resetProfileUpdate());
    }
  }, [dispatch, router, showSnackbar, t, updateState]);

  const profile = profileState.data;
  const displayName = profile
    ? `${profile.name ?? ''} ${profile.lastname ?? ''}`.replace(/\s+/g, ' ').trim()
    : '';
  const profileInitials = profile ? getInitialsFromText(displayName || profile.email, '?') : '?';

  const handleSubmit = (values: MyProfileFormValues) => {
    const cellPhone =
      values.cellPhone.countryCode || values.cellPhone.number
        ? {
            countryCode: values.cellPhone.countryCode,
            number: values.cellPhone.number,
          }
        : null;

    const password =
      values.password && values.password === values.confirmPassword ? values.password : '';

    void dispatch(
      updateMyProfile({
        name: values.name,
        lastname: values.lastname,
        cellPhone,
        password: password ? password : undefined,
      })
    );
  };

  const isLoading = !authHydrated || profileState.status === 'loading';
  const isSubmitting = updateState.status === 'loading';

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs.dashboard'), href: '/dashboard', hideOnDesktop: true },
              { label: t('myProfile.breadcrumb'), href: '/dashboard/me' },
              { label: t('myProfile.actions.edit') },
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
          className="flex flex-col gap-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {isLoading ? (
                <Skeleton className="h-16 w-16 rounded-2xl" />
              ) : (
                <Avatar className="h-16 w-16 rounded-2xl border border-border/60 bg-muted/60">
                  <AvatarFallback className="rounded-2xl text-lg font-semibold text-foreground">
                    {profileInitials}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="space-y-1">
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-36 rounded-md" />
                    <Skeleton className="h-4 w-64 rounded-md" />
                  </>
                ) : (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      {t('myProfile.actions.edit')}
                    </Typography>
                    <Typography variant="body2" color="text.foreground">
                      {t('myProfile.edit.subtitle')}
                    </Typography>
                  </>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/me')}
              disabled={isLoading}
            >
              {t('myProfile.actions.cancel')}
            </Button>
          </div>
        </Box>
        <div className="flex flex-1 flex-col">
          {isLoading ? (
            <div className="flex flex-1 flex-col gap-4 p-6">
              <Skeleton className="h-8 w-1/3 rounded-md" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          ) : profile ? (
            <MyProfileForm
              email={profile.email}
              defaultValues={{
                name: profile.name,
                lastname: profile.lastname,
                cellPhone: {
                  countryCode: profile.cellPhone?.countryCode ?? '',
                  number: profile.cellPhone?.number ?? '',
                },
              }}
              onSubmit={handleSubmit}
              onCancel={() => router.push('/dashboard/me')}
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
              {t('myProfile.detail.empty')}
            </div>
          )}
        </div>
      </Paper>
      {isSubmitting ? <FullScreenLoader text={t('myProfile.form.actions.saving')} /> : null}
    </div>
  );
}
