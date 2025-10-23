'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchDashboardMetrics } from '@/features/dashboard';

export default function DashboardHomePage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
  }, [dispatch]);

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-slate-900 p-8 text-white">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Dashboard general</h1>
        <p className="text-sm text-slate-300">Resumen de métricas clave para tu organización.</p>
      </header>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-slate-800 p-4">
          <h2 className="text-sm uppercase text-slate-400">Usuarios</h2>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="rounded-lg bg-slate-800 p-4">
          <h2 className="text-sm uppercase text-slate-400">Servicios activos</h2>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="rounded-lg bg-slate-800 p-4">
          <h2 className="text-sm uppercase text-slate-400">Invitaciones pendientes</h2>
          <p className="text-2xl font-bold">—</p>
        </div>
      </section>
      <nav className="flex gap-4">
        <Link
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-900"
          href="/dashboard/users"
        >
          Gestionar usuarios
        </Link>
        <Link
          className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium"
          href="/dashboard/services"
        >
          Gestionar servicios
        </Link>
      </nav>
    </main>
  );
}
