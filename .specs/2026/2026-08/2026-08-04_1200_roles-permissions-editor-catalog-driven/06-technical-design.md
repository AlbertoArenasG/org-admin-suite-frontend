# Technical Design

## Scope

- `src/components/roles/RolePermissionsEditor.tsx`
- `src/components/roles/roleFormUtils.ts`
- `src/components/roles/RoleForm.tsx`
- wiring de `new` y `edit` del CRUD de roles

## Contracts

- contrato actual:
  - `GET /v1/roles/modules`
  - `GET /v1/roles/operations`
- contrato objetivo recomendado:
  - `GET /v1/roles/modules` enriquecido con operaciones válidas por módulo

## State Changes

- adaptar el shape de catálogos de `roles` si backend devuelve operaciones embebidas por módulo
- evitar reglas frontend que dependan de una lista fija `READ/CREATE/UPDATE/DELETE`

## UI Behavior

- cada módulo renderiza solo sus operaciones válidas
- módulos con una sola operación muestran un solo chip
- módulos con operaciones parciales no inventan acciones ausentes
- la dependencia automática de `READ` solo se aplica cuando el módulo declare `READ`

## Validation

- crear o editar un rol con `USER_REGISTRATION_INVITATIONS/CREATE` debe ser válido
- crear o editar un rol con `SERVICE_ENTRY_SURVEYS/UPDATE` no debe ser posible desde UI
- crear o editar un rol con `FILES/DELETE` no debe ser posible desde UI

## Open Questions

- si `GET /v1/roles/operations` sigue siendo necesario después de enriquecer `modules`
- si conviene renderizar operaciones en el orden que backend las devuelva o imponer un orden visual estable
