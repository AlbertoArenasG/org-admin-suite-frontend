'use client';

import { DashboardShellPlayground } from '@/components/playground/DashboardShellPlayground';
import { useAppSelector } from '@/hooks/useAppSelector';

export default function DashboardPlaygroundPage() {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.systemRole !== 'MASTER_ADMIN') {
    return (
      <p className="p-6 text-sm text-muted-foreground">No tienes acceso a este espacio interno.</p>
    );
  }

  return <DashboardShellPlayground />;
}
