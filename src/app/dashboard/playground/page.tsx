'use client';

import { CustomerServiceRecordFormPlayground } from '@/components/playground/CustomerServiceRecordFormPlayground';
import { useAppSelector } from '@/hooks/useAppSelector';

export default function PlaygroundPage() {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.systemRole !== 'MASTER_ADMIN') {
    return (
      <p className="text-sm text-muted-foreground">No tienes acceso a este espacio interno.</p>
    );
  }

  return <CustomerServiceRecordFormPlayground />;
}
