'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusAlert } from '@/components/shared/StatusAlert';
import { hydrateAuthFromStorage } from '@/features/auth/persistence';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { selectHasAuthorizationLoaded } from '@/features/auth';

interface AuthGuardProps extends PropsWithChildren {
  className?: string;
  redirectTo?: string;
}

export function AuthGuard({ children, className, redirectTo = '/login' }: AuthGuardProps) {
  const { t } = useTranslation('auth');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { token, status, hydrated } = useAppSelector((state) => state.auth);
  const hasAuthorizationLoaded = useAppSelector(selectHasAuthorizationLoaded);

  useEffect(() => {
    if (!hydrated || status === 'loading') {
      return;
    }

    if (!token) {
      const next = encodeURIComponent(pathname || '/dashboard');
      router.replace(`${redirectTo}?next=${next}`);
    }
  }, [token, status, hydrated, router, redirectTo, pathname]);

  if (hydrated && token && status === 'failed' && !hasAuthorizationLoaded) {
    return (
      <main
        className={cn('flex min-h-screen items-center justify-center bg-background p-6', className)}
      >
        <div className="flex w-full max-w-md flex-col items-start gap-4">
          <StatusAlert
            variant="destructive"
            icon={AlertCircle}
            title={t('sessionCheckFailed.title')}
            description={t('sessionCheckFailed.description')}
            className="w-full"
          />
          <Button type="button" onClick={() => void hydrateAuthFromStorage(dispatch)}>
            {t('sessionCheckFailed.retry')}
          </Button>
        </div>
      </main>
    );
  }

  if (!hydrated || status === 'loading' || !token || !hasAuthorizationLoaded) {
    return (
      <div className={cn('flex min-h-screen items-center justify-center bg-background', className)}>
        <Spinner className="size-8 text-primary" aria-label="Cargando sesión" />
      </div>
    );
  }

  return <>{children}</>;
}
