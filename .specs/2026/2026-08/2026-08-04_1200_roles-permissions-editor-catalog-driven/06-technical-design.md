# Technical Design

## Scope

- `src/features/roles/types.ts`
- `src/features/roles/rolesThunks.ts`
- `src/components/roles/RolePermissionsEditor.tsx`
- `src/components/roles/roleFormUtils.ts`
- `src/components/roles/RoleForm.tsx`
- wiring de `new` y `edit` del CRUD de roles

## Contracts

- contrato actual:
  - `GET /v1/roles/modules`
  - `GET /v1/roles/operations`
- contrato objetivo aprobado:
  - `GET /v1/roles/modules` enriquecido con operaciones válidas por módulo
  - `GET /v1/roles/operations` eliminado

### Shape objetivo consumido por frontend

```ts
type RoleModuleCatalogItem = {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  moduleNameKey: string;
  statusId: string;
  isSystem: boolean;
  operations: Array<{
    operationId: string;
    operationCode: string;
    operationName: string;
    operationNameKey: string;
    statusId: string;
    isSystem: boolean;
  }>;
};
```

## State Changes

- adaptar `catalogs.modules` para que cada módulo incluya sus `operations[]`
- remover `catalogs.operations` del feature `roles`
- eliminar helpers frontend que dependan de una lista fija `READ/CREATE/UPDATE/DELETE`
- conservar únicamente reglas derivadas desde el catálogo real devuelto por backend

## UI Behavior

- cada módulo renderiza solo sus operaciones válidas
- módulos con una sola operación muestran un solo chip
- módulos con operaciones parciales no inventan acciones ausentes
- la dependencia automática de `READ` solo se aplica cuando el módulo declare `READ`
- si un módulo no declara `READ`, no se muestra hint ni autoactivación asociada
- el orden visual debe respetar la secuencia que backend entregue para cada módulo, salvo que se apruebe un orden visual distinto más adelante

## Validation

- crear o editar un rol con `USER_REGISTRATION_INVITATIONS/CREATE` debe ser válido
- crear o editar un rol con `SERVICE_ENTRY_SURVEYS/UPDATE` no debe ser posible desde UI
- crear o editar un rol con `FILES/DELETE` no debe ser posible desde UI
- crear o editar un rol con `SERVICE_PACKAGES/CREATE` no debe ser posible desde UI
- el payload enviado por frontend no debe incluir operaciones inexistentes para ningún módulo
- backend no debería volver a responder errores de validación causados por la antigua cuadrícula cuadrada

## Open Questions

- si conviene renderizar operaciones en el orden que backend las devuelva o imponer un orden visual estable
