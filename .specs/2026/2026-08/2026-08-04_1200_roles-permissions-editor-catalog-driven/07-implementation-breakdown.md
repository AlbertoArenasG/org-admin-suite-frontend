# Implementation Breakdown

## Slice 1. Feature Contract Refactor

### Objective

Adaptar el feature `roles` al contrato backend vigente de módulos enriquecidos y retirar la dependencia del endpoint separado de operaciones.

### Files

- `src/features/roles/types.ts`
- `src/features/roles/rolesThunks.ts`
- páginas `new` y `edit` si necesitan ajuste de carga

### Microphases

#### Slice 1.1. Types

- mover `operations[]` dentro de `RoleModuleCatalogItem`
- retirar `RoleOperationCatalogItem[]` como dependencia del editor

#### Slice 1.2. Thunks

- dejar `fetchRoleModules` consumiendo el shape enriquecido
- eliminar `fetchRoleOperations`

#### Slice 1.3. Wiring

- ajustar consumidores de catálogos en create/edit/detail

Done when:

- frontend ya no consume `GET /v1/roles/operations`
- el estado de catálogos ya refleja el contrato real por módulo

## Slice 2. Catalog-Driven Editor

### Objective

Refactorizar el editor para renderizar y serializar permisos solo desde el catálogo real devuelto por backend.

### Files

- `src/components/roles/RolePermissionsEditor.tsx`
- `src/components/roles/roleFormUtils.ts`
- `src/components/roles/RoleForm.tsx`

### Microphases

#### Slice 2.1. Rendering

- renderizar solo `module.operations`
- soportar módulos con cardinalidad variable

#### Slice 2.2. Toggle rules

- aplicar dependencia de `READ` solo cuando el módulo incluya `READ`
- no inventar `READ` ni hints en módulos sin esa operación

#### Slice 2.3. Serialization

- serializar únicamente combinaciones visibles y válidas

Done when:

- la UI deja de mostrar cuadrícula CRUD uniforme
- el editor ya no puede producir combinaciones inválidas por diseño

## Slice 3. Validation And Closeout

### Objective

Validar create/edit con módulos parciales y dejar la spec lista para cierre.

### Microphases

- probar módulos `USER_REGISTRATION_INVITATIONS`, `FILES`, `SERVICE_ENTRY_SURVEYS`, `SERVICE_PACKAGES`
- confirmar ausencia de errores de validación por operaciones inexistentes
- actualizar progreso, task list y breakdown

Done when:

- los flows de create/edit funcionan con catálogo real
- la spec queda actualizada al estado real
