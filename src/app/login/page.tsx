'use client';

import { Suspense, useEffect, useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { ModeToggle } from '@/components/shared/ModeToggle';
import SelectLang from '@/components/shared/LangToggle';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { Spinner } from '@/components/ui/spinner';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useRouter } from 'next/navigation';
import { FullScreenLoader } from '@/components/ui/full-screen-loader';

export default function LoginPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setCheckingSession(false);
      return;
    }

    const handle = window.requestAnimationFrame(() => {
      router.replace('/dashboard');
    });

    return () => {
      window.cancelAnimationFrame(handle);
    };
  }, [token, router]);

  if (checkingSession) {
    return (
      <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <FullScreenLoader />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="absolute right-6 top-6 flex gap-2 md:right-10 md:top-10">
        <SelectLang />
        <ModeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <BrandLogo href="#" size="lg" className="self-center" />
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <Spinner className="size-6 text-primary" aria-label="Cargando formulario" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
