import * as React from 'react';

import {
  MutationFeedback,
  type MutationFeedback as MutationFeedbackData,
  MutationRecovery,
  type MutationRecovery as MutationRecoveryData,
} from '@/components/feedback';
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
  mutationFeedback?: MutationFeedbackData;
  mutationRecovery?: MutationRecoveryData;
};

function ResourceFormActions({
  cancelAction,
  className,
  destructiveAction,
  mutationFeedback,
  mutationRecovery,
  primaryAction,
  retryAction,
  secondaryActions,
  status = 'idle',
  ...props
}: ResourceFormActionsProps) {
  const isSaving = status === 'saving';
  const replacesActions =
    mutationFeedback?.status === 'saving' || mutationFeedback?.status === 'success';

  return (
    <div
      aria-busy={isSaving || undefined}
      className={cn('flex w-full flex-wrap items-center justify-between gap-3', className)}
      data-slot="resource-form-actions"
      data-status={status}
      {...props}
    >
      {replacesActions && mutationFeedback ? (
        <div className="flex w-full justify-end">
          <MutationFeedback {...mutationFeedback} />
        </div>
      ) : (
        <>
          <div className="flex min-w-0 flex-1 basis-full flex-wrap items-center gap-2 sm:basis-auto">
            {destructiveAction ? (
              <ActionButton action={destructiveAction} type="button" variant="destructive" />
            ) : null}
            {secondaryActions}
            {mutationRecovery ? (
              <MutationRecovery className="basis-full sm:basis-auto" {...mutationRecovery} />
            ) : null}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {retryAction ? (
              <ActionButton action={retryAction} type="button" variant="outline" />
            ) : null}
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
        </>
      )}
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
