'use client';

import { ActionsButtonsCatalogPlayground } from '@/components/playground/ActionsButtonsCatalogPlayground';
import { useAppSelector } from '@/hooks/useAppSelector';

export default function ActionsButtonsCatalogPage() {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.systemRole !== 'MASTER_ADMIN') {
    return (
      <p className="p-6 text-sm text-muted-foreground">No tienes acceso a este espacio interno.</p>
    );
  }

  return <ActionsButtonsCatalogPlayground />;
}
