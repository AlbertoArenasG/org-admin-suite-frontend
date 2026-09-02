import type { ReactNode } from 'react';

export function StructureModelLayerLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit rounded-md border border-dashed border-[var(--secondary-300)] bg-background/80 px-2 py-1 text-[11px] font-semibold tracking-[0.08em] text-[var(--secondary-700)] uppercase">
      {children}
    </span>
  );
}
