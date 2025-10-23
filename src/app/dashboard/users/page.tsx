'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUsers } from '@/features/users';

export default function DashboardUsersPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-white p-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Administra los miembros de la organización y gestiona sus permisos.
        </p>
      </header>
      <section className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Tabla de usuarios pendiente de implementar.
      </section>
    </main>
  );
}
