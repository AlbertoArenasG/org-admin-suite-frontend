'use client';

import { NavigationCanvasCompositionPlayground } from '@/components/playground/NavigationCanvasCompositionPlayground';
import { useAppSelector } from '@/hooks/useAppSelector';

export default function NavigationCompositionDemoPage() {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.systemRole !== 'MASTER_ADMIN') {
    return (
      <p className="p-6 text-sm text-muted-foreground">No tienes acceso a este experimento.</p>
    );
  }

  return <NavigationCanvasCompositionPlayground />;
}
