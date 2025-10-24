'use client';

import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { ModeToggle } from '@/components/shared/ModeToggle';
import SelectLang from '@/components/shared/LangToggle';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { Spinner } from '@/components/ui/spinner';

export default function LoginPage() {
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
