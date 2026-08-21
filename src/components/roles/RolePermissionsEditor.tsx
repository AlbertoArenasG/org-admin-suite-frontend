'use client';

import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { cn } from '@/lib/utils';
import type { RoleModuleCatalogItem } from '@/features/roles/types';
import {
  buildPermissionCatalog,
  buildPermissionKey,
  parsePermissionKey,
  READ_OPERATION_CODE,
  type RolePermissionKey,
} from '@/components/roles/roleFormUtils';

interface RolePermissionsEditorProps {
  modules: RoleModuleCatalogItem[];
  selection: Set<RolePermissionKey>;
  onToggle: (moduleCode: string, operationCode: string) => void;
  onToggleModule: (moduleCode: string, operationCodes: string[]) => void;
  disabled?: boolean;
  labels: {
    title: string;
    helper: string;
    selectAll: string;
    deselectAll: string;
  };
}

export function RolePermissionsEditor({
  modules,
  selection,
  onToggle,
  onToggleModule,
  disabled = false,
  labels,
}: RolePermissionsEditorProps) {
  const catalog = buildPermissionCatalog({ modules });

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {labels.title}
        </Typography>
        <p className="text-sm text-muted-foreground">{labels.helper}</p>
      </div>

      <div className="grid gap-4">
        {catalog.map((module) => (
          <div
            key={module.moduleId}
            className="rounded-2xl border border-border/60 bg-card/40 px-4 py-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1 md:max-w-xs">
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {module.moduleName}
                </Typography>
              </div>

              <div className="flex flex-1 flex-col items-start gap-2 md:items-end">
                <Button
                  size="small"
                  variant="text"
                  disabled={disabled}
                  onClick={() =>
                    onToggleModule(
                      module.moduleCode,
                      module.operations.map((operation) => operation.operationCode)
                    )
                  }
                >
                  {module.operations.every((operation) =>
                    selection.has(buildPermissionKey(module.moduleCode, operation.operationCode))
                  )
                    ? labels.deselectAll
                    : labels.selectAll}
                </Button>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  {module.operations.map((operation) => {
                    const key = buildPermissionKey(module.moduleCode, operation.operationCode);
                    const active = selection.has(key);
                    const readLocked =
                      operation.operationCode === READ_OPERATION_CODE &&
                      Array.from(selection).some((entry) => {
                        const permission = parsePermissionKey(entry);
                        return (
                          permission.module === module.moduleCode &&
                          permission.operation !== READ_OPERATION_CODE
                        );
                      });

                    return (
                      <Chip
                        key={operation.operationId}
                        label={operation.operationName}
                        clickable={!disabled && !readLocked}
                        disabled={disabled || readLocked}
                        color={active ? 'primary' : 'default'}
                        variant={active ? 'filled' : 'outlined'}
                        onClick={() => onToggle(module.moduleCode, operation.operationCode)}
                        className={cn(active ? 'font-medium' : undefined)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
