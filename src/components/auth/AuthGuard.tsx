'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface AuthGuardProps extends PropsWithChildren {
  className?: string;
  redirectTo?: string;
}

export function AuthGuard({ children, className, redirectTo = '/login' }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, status, hydrated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!hydrated || status === 'loading') {
      return;
    }

    if (!token) {
      const next = encodeURIComponent(pathname || '/dashboard');
      router.replace(`${redirectTo}?next=${next}`);
    }
  }, [token, status, hydrated, router, redirectTo, pathname]);

  if (!hydrated || status === 'loading' || !token) {
    return (
      <div className={cn('flex min-h-screen items-center justify-center bg-background', className)}>
        <Spinner className="size-8 text-primary" aria-label="Cargando sesión" />
      </div>
    );
  }

  return <>{children}</>;
}
