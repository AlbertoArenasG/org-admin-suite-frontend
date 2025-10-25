'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { UserForm, type UserFormValues } from '@/components/users/UserForm';
import type { ComponentProps } from 'react';

export interface UsersTableInviteSheetProps {
  open: boolean;
  onOpenChange: ComponentProps<typeof Sheet>['onOpenChange'];
  defaultValues: UserFormValues;
  roleOptions: Parameters<typeof UserForm>[0]['roleOptions'];
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
  title: string;
  description: string;
}

export function UsersTableInviteSheet({
  open,
  onOpenChange,
  defaultValues,
  roleOptions,
  onSubmit,
  onCancel,
  title,
  description,
}: UsersTableInviteSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <UserForm
          mode="create"
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={onCancel}
          roleOptions={roleOptions}
        />
      </SheetContent>
    </Sheet>
  );
}

export interface UsersTableEditSheetProps {
  open: boolean;
  onOpenChange: ComponentProps<typeof Sheet>['onOpenChange'];
  targetExists: boolean;
  defaultValues?: UserFormValues;
  roleOptions: Parameters<typeof UserForm>[0]['roleOptions'];
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
  title: string;
  description: string;
}

export function UsersTableEditSheet({
  open,
  onOpenChange,
  targetExists,
  defaultValues,
  roleOptions,
  onSubmit,
  onCancel,
  title,
  description,
}: UsersTableEditSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {targetExists && defaultValues ? (
          <UserForm
            mode="edit"
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onCancel={onCancel}
            roleOptions={roleOptions}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

export interface UsersTableDeleteSheetProps {
  open: boolean;
  onOpenChange: ComponentProps<typeof Sheet>['onOpenChange'];
  name: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UsersTableDeleteSheet({
  open,
  onOpenChange,
  name,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: UsersTableDeleteSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <SheetFooter className="mt-auto flex-col gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
