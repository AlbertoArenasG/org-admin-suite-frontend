'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ModeToggle } from '@/components/shared/ModeToggle';
import SelectLang from '@/components/shared/LangToggle';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { FullScreenLoader } from '@/components/ui/full-screen-loader';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? null;

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="absolute right-6 top-6 flex gap-2 md:right-10 md:top-10">
        <SelectLang />
        <ModeToggle />
      </div>
      <div className="flex w-full max-w-md flex-col gap-6">
        <BrandLogo href="#" size="lg" className="self-center" />
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FullScreenLoader text="" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
