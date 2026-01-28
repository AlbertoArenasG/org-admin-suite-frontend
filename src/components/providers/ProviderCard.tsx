import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';

import { Card, CardAction, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Provider } from '@/features/providers/providersSlice';
import { getProviderStatusTone } from '@/components/providers/status';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ProviderCardLabels {
  notAvailable: string;
  actions: {
    viewDetail: string;
    edit: string;
    delete: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

interface ProviderCardProps {
  provider: Provider;
  labels: ProviderCardLabels;
  formatDate: (value: string | null) => string;
  onEdit?: (provider: Provider) => void;
  onDelete?: (provider: Provider) => void;
}

export function ProviderCard({
  provider,
  labels,
  formatDate,
  onEdit,
  onDelete,
}: ProviderCardProps) {
  const providerStatusName = provider.statusName || labels.notAvailable;

  return (
    <Card className="rounded-3xl border border-border/70 bg-card/90 shadow-md">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1 text-left">
          <CardTitle className="text-xl leading-tight">
            {provider.companyName || provider.providerCode}
          </CardTitle>
          <p className="text-sm text-muted-foreground break-all">
            {provider.providerCode || labels.notAvailable}
          </p>
        </div>
        <CardAction className="flex w-full flex-col items-end gap-3 md:w-auto">
          <span
            className={cn(
              'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
              getProviderStatusTone(provider.statusId)
            )}
          >
            {providerStatusName}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="whitespace-nowrap">
              <Link href={`/dashboard/providers/${provider.id}`}>{labels.actions.viewDetail}</Link>
            </Button>
            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Acciones">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit ? (
                    <DropdownMenuItem onClick={() => onEdit(provider)}>
                      {labels.actions.edit}
                    </DropdownMenuItem>
                  ) : null}
                  {onDelete ? (
                    <DropdownMenuItem
                      onClick={() => onDelete(provider)}
                      className="text-destructive focus:text-destructive"
                    >
                      {labels.actions.delete}
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardAction>
      </CardHeader>
      <CardFooter className="grid gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground/70">
            {labels.metadata.createdAt}
          </span>
          <span className="font-semibold text-foreground">{formatDate(provider.createdAt)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground/70">
            {labels.metadata.updatedAt}
          </span>
          <span className="font-semibold text-foreground">
            {formatDate(provider.updatedAt || provider.createdAt)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
