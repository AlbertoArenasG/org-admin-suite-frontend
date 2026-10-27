import type { PropsWithChildren } from 'react';
export function ScrollArea({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={className}>{children}</div>;
}
