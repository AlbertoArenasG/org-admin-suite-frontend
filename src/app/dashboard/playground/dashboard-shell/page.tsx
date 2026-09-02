'use client';

import { DashboardShellPlayground } from '@/components/playground/DashboardShellPlayground';
import { useAppSelector } from '@/hooks/useAppSelector';

export default function DashboardShellPlaygroundPage() {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.systemRole !== 'MASTER_ADMIN') {
    return (
      <p className="text-sm text-muted-foreground">No tienes acceso a este espacio interno.</p>
    );
  }

  return <DashboardShellPlayground />;
}
