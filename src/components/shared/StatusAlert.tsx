import type { ComponentType, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type AlertVariant = 'default' | 'destructive';
type AlertSize = 'sm' | 'md';

export interface StatusAlertProps {
  variant?: AlertVariant;
  title: ReactNode;
  description?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  size?: AlertSize;
  className?: string;
}

const sizeStyles: Record<AlertSize, string> = {
  sm: 'py-2 text-sm [&>svg]:size-3.5 [&_[data-slot=alert-title]]:text-sm',
  md: 'py-3 text-base [&>svg]:size-4',
};

export function StatusAlert({
  variant = 'default',
  title,
  description,
  icon: Icon,
  size = 'md',
  className,
}: StatusAlertProps) {
  return (
    <Alert variant={variant} className={cn(sizeStyles[size], className)} data-slot="status-alert">
      {Icon ? <Icon className="size-4 text-current" /> : null}
      <AlertTitle data-slot="alert-title">{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </Alert>
  );
}
