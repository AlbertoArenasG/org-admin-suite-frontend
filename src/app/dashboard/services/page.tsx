'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchServices } from '@/features/services';

export default function DashboardServicesPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-white p-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Servicios</h1>
        <p className="text-sm text-muted-foreground">
          Crea, publica y administra los servicios ofrecidos a tus clientes.
        </p>
      </header>
      <section className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Listado de servicios pendiente de implementar.
      </section>
    </main>
  );
}
