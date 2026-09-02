'use client';

import { StickyCollapsiblePageHeaderPlayground } from '@/components/playground/StickyCollapsiblePageHeaderPlayground';
import { useAppSelector } from '@/hooks/useAppSelector';

export default function StickyPageHeaderPlaygroundPage() {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.systemRole !== 'MASTER_ADMIN') {
    return (
      <p className="p-6 text-sm text-muted-foreground">No tienes acceso a este espacio interno.</p>
    );
  }

  return <StickyCollapsiblePageHeaderPlayground />;
}
