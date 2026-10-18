'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Spinner } from '@/components/ui/spinner';
import { useAppSelector } from '@/hooks/useAppSelector';

export default function Home() {
  const router = useRouter();
  const { hydrated, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (hydrated) router.replace(token ? '/dashboard' : '/login');
  }, [hydrated, router, token]);

  return (
    <main className="flex min-h-svh items-center justify-center bg-background">
      <Spinner className="size-8 text-primary" aria-label="Cargando sesión" />
    </main>
  );
}
