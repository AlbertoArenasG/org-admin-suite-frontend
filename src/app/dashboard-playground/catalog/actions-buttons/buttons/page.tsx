'use client';

import { ButtonCatalogPlayground } from '@/components/playground/ButtonCatalogPlayground';
import { useAppSelector } from '@/hooks/useAppSelector';

export default function ButtonCatalogPage() {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.systemRole !== 'MASTER_ADMIN') {
    return (
      <p className="p-6 text-sm text-muted-foreground">No tienes acceso a este espacio interno.</p>
    );
  }

  return <ButtonCatalogPlayground />;
}
