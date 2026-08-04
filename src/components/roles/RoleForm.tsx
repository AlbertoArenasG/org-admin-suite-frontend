'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RoleDetail, RoleModuleCatalogItem, RolePermission } from '@/features/roles/types';
import { RolePermissionsEditor } from '@/components/roles/RolePermissionsEditor';
import {
  permissionsToSelection,
  selectionToPermissions,
  togglePermissionSelection,
  type RolePermissionKey,
} from '@/components/roles/roleFormUtils';

export interface RoleFormValues {
  name: string;
  permissions: RolePermission[];
}

interface RoleFormProps {
  mode: 'create' | 'edit';
  role?: RoleDetail | null;
  modules: RoleModuleCatalogItem[];
  onSubmit: (values: RoleFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  disableActions?: boolean;
}

function buildInitialValues(role?: RoleDetail | null): RoleFormValues {
  return {
    name: role?.name ?? '',
    permissions: role?.permissions ?? [],
  };
}

export function RoleForm({
  mode,
  role,
  modules,
  onSubmit,
  onCancel,
  isSubmitting = false,
  disableActions = false,
}: RoleFormProps) {
  const { t } = useTranslation('roles');
  const [selection, setSelection] = useState<Set<RolePermissionKey>>(
    permissionsToSelection(role?.permissions ?? [])
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
    reset,
  } = useForm<RoleFormValues>({
    defaultValues: buildInitialValues(role),
  });

  useEffect(() => {
    reset(buildInitialValues(role));
    setSelection(permissionsToSelection(role?.permissions ?? []));
  }, [reset, role]);

  const effectiveSubmitting = isSubmitting || isFormSubmitting;
  const hasAnyPermission = selection.size > 0;
  const effectiveDisabled = disableActions || effectiveSubmitting;

  const submitHandler = handleSubmit((values) => {
    onSubmit({
      name: values.name.trim(),
      permissions: selectionToPermissions(selection),
    });
  });

  const nameHelpText = useMemo(
    () => (mode === 'edit' ? t('form.hints.nameImmutable') : t('form.hints.nameCreate')),
    [mode, t]
  );

  const moduleByCode = useMemo(
    () => new Map(modules.map((module) => [module.moduleCode, module])),
    [modules]
  );

  return (
    <form onSubmit={submitHandler} className="flex h-full flex-col gap-6" noValidate>
      <div className="flex flex-col gap-6 p-4">
        <div className="grid gap-2">
          <Label htmlFor="role-name">{t('form.labels.name')}</Label>
          <Input
            id="role-name"
            placeholder={t('form.placeholders.name')}
            disabled={mode === 'edit'}
            {...register('name', {
              required: mode === 'create' ? t('form.errors.nameRequired') : false,
              validate: (value) => {
                if (mode === 'create' && value.trim().length < 1) {
                  return t('form.errors.nameRequired');
                }
                return true;
              },
            })}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          <p className="text-sm text-muted-foreground">{nameHelpText}</p>
          {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
        </div>

        <RolePermissionsEditor
          modules={modules}
          selection={selection}
          disabled={disableActions}
          onToggle={(moduleCode, operationCode) => {
            if (disableActions) {
              return;
            }
            setSelection((current) =>
              togglePermissionSelection({
                current,
                moduleCode,
                operationCode,
                hasReadOperation: Boolean(
                  moduleByCode
                    .get(moduleCode)
                    ?.operations.some((operation) => operation.operationCode === 'READ')
                ),
              })
            );
          }}
          labels={{
            title: t('form.labels.permissions'),
            helper: t('form.hints.permissionsHelper'),
            readHint: t('form.hints.readDependency'),
          }}
        />

        {!hasAnyPermission ? (
          <p className="text-sm text-destructive">{t('form.errors.permissionsRequired')}</p>
        ) : null}
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border/50 bg-muted/10 p-4 sm:flex-row sm:justify-end sm:gap-3">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={effectiveDisabled}>
            {t('form.cancel')}
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={effectiveDisabled || !hasAnyPermission}
          className="sm:min-w-[10rem]"
        >
          {effectiveSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('form.submitting')}
            </>
          ) : (
            t(`form.submit.${mode}`)
          )}
        </Button>
      </div>
    </form>
  );
}
