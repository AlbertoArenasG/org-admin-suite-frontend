'use client';

import type { PropsWithChildren } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function NextDashboardDemoLayout({ children }: PropsWithChildren) {
  return <AuthGuard>{children}</AuthGuard>;
}
