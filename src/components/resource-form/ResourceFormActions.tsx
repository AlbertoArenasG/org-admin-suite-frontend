import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { ResourceFormStatus } from '@/components/resource-form/ResourceFormFrame';
import { cn } from '@/lib/utils';

type ActionDefinition = {
  label: React.ReactNode;
  loadingLabel?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  ariaLabel?: string;
};

type ResourceFormActionsProps = React.ComponentProps<'div'> & {
  status?: ResourceFormStatus;
  primaryAction?: ActionDefinition;
  cancelAction?: ActionDefinition;
  retryAction?: ActionDefinition;
  destructiveAction?: ActionDefinition;
  secondaryActions?: React.ReactNode;
};

function ResourceFormActions({
  cancelAction,
  className,
  destructiveAction,
  primaryAction,
  retryAction,
  secondaryActions,
  status = 'idle',
  ...props
}: ResourceFormActionsProps) {
  const isSaving = status === 'saving';

  return (
    <div
      aria-busy={isSaving || undefined}
      className={cn('flex w-full flex-wrap items-center justify-between gap-3', className)}
      data-slot="resource-form-actions"
      data-status={status}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2">
        {destructiveAction ? (
          <ActionButton action={destructiveAction} type="button" variant="destructive" />
        ) : null}
        {secondaryActions}
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {retryAction ? <ActionButton action={retryAction} type="button" variant="outline" /> : null}
        {cancelAction ? (
          <ActionButton action={cancelAction} type="button" variant="outline" />
        ) : null}
        {primaryAction ? (
          <ActionButton
            action={primaryAction}
            disabled={isSaving || primaryAction.disabled}
            isLoading={isSaving}
            type="submit"
            variant="default"
          />
        ) : null}
      </div>
    </div>
  );
}

type ActionButtonProps = {
  action: ActionDefinition;
  disabled?: boolean;
  isLoading?: boolean;
  type: 'button' | 'submit';
  variant: NonNullable<React.ComponentProps<typeof Button>['variant']>;
};

function ActionButton({ action, disabled, isLoading = false, type, variant }: ActionButtonProps) {
  const isDisabled = disabled || action.disabled;

  return (
    <Button
      aria-label={action.ariaLabel}
      aria-busy={isLoading || undefined}
      disabled={isDisabled}
      onClick={action.onClick}
      type={type}
      variant={variant}
    >
      {isLoading ? (
        <>
          <Spinner aria-hidden="true" />
          {action.loadingLabel ?? action.label}
        </>
      ) : (
        action.label
      )}
    </Button>
  );
}

export { ResourceFormActions };
export type { ActionDefinition, ResourceFormActionsProps };
