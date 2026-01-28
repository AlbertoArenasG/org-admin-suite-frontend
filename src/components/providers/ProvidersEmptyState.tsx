import { Building2 } from 'lucide-react';

interface ProvidersEmptyStateProps {
  message: string;
}

export function ProvidersEmptyState({ message }: ProvidersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/60 bg-muted/30 px-6 py-12 text-center shadow-inner">
      <Building2 className="size-12 text-muted-foreground" aria-hidden />
      <p className="max-w-md text-base text-muted-foreground">{message}</p>
    </div>
  );
}
