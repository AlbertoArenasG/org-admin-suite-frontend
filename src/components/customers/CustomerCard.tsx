import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Customer } from '@/features/customers/customersSlice';
import { getCustomerStatusTone } from '@/components/customers/status';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface CustomerCardLabels {
  clientCode: string;
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

interface CustomerCardProps {
  customer: Customer;
  labels: CustomerCardLabels;
  formatDate: (value: string | null) => string;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export function CustomerCard({
  customer,
  labels,
  formatDate,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  return (
    <Card className="rounded-3xl border border-border/70 bg-card/90 shadow-md">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1 text-left">
          <CardTitle className="text-xl leading-tight">
            {customer.companyName || customer.clientCode}
          </CardTitle>
          <p className="text-sm text-muted-foreground break-all">
            {customer.clientCode || labels.notAvailable}
          </p>
        </div>
        <CardAction className="flex w-full flex-col items-end gap-3 md:w-auto">
          <span
            className={cn(
              'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
              getCustomerStatusTone(customer.statusId)
            )}
          >
            {customer.statusName}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="whitespace-nowrap">
              <Link href={`/dashboard/customers/${customer.id}`}>{labels.actions.viewDetail}</Link>
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
                    <DropdownMenuItem onClick={() => onEdit(customer)}>
                      {labels.actions.edit}
                    </DropdownMenuItem>
                  ) : null}
                  {onDelete ? (
                    <DropdownMenuItem
                      onClick={() => onDelete(customer)}
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
          <span className="font-semibold text-foreground">{formatDate(customer.createdAt)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground/70">
            {labels.metadata.updatedAt}
          </span>
          <span className="font-semibold text-foreground">
            {formatDate(customer.updatedAt || customer.createdAt)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
