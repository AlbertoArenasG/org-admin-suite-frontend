import type { ReactNode } from 'react';

interface AuthAuroraBackgroundProps {
  children: ReactNode;
}

export function AuthAuroraBackground({ children }: AuthAuroraBackgroundProps) {
  return (
    <main className="auth-aurora-background">
      <div className="auth-aurora-background__lights" aria-hidden="true" />
      <div className="auth-aurora-background__content">{children}</div>
    </main>
  );
}
