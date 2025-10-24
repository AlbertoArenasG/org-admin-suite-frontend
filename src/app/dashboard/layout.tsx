'use client';

import type { PropsWithChildren } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AuthGuard>{children}</AuthGuard>;
}
