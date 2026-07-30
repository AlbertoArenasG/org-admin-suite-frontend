# Technical Design

## Scope

- módulo de roles dentro del dashboard autenticado
- listado, detalle, creación, edición, cambio de status y delete
- consumo de catálogos de módulos y operaciones
- visibilidad del módulo basada en permisos `ROLES/*`

## Routes

- `src/app/dashboard/roles/page.tsx`
- `src/app/dashboard/roles/new/page.tsx`
- `src/app/dashboard/roles/[roleId]/page.tsx`
- `src/app/dashboard/roles/[roleId]/edit/page.tsx`

Patrón:

- páginas pequeñas orientadas a composición, breadcrumbs y routing
- lógica de datos en `src/features/roles/*`
- formularios y vistas en componentes separados

## Feature State

Archivos objetivo:

- `src/features/roles/types.ts`
- `src/features/roles/rolesThunks.ts`
- `src/features/roles/rolesSlice.ts`
- opcionalmente `src/features/roles/selectors.ts` si el slice lo justifica

Shape objetivo del slice:

```ts
type RolesState = {
  list: {
    items: RoleListItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    search: string;
    filters: {
      scope: string | null;
      status: string | null;
      isSystem: boolean | null;
    };
    sorts: Array<{ field: 'name' | 'code' | 'status' | 'created_at'; direction: 'asc' | 'desc' }>;
  };
  detail: {
    item: RoleDetail | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  catalogs: {
    modules: RoleModuleCatalogItem[];
    operations: RoleOperationCatalogItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  mutations: {
    createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    changeStatusStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
};
```

## Contracts

- `GET /v1/roles`
- `GET /v1/roles/:roleId`
- `POST /v1/roles`
- `PATCH /v1/roles/:roleId`
- `PATCH /v1/roles/:roleId/status`
- `DELETE /v1/roles/:roleId`
- `GET /v1/roles/modules`
- `GET /v1/roles/operations`

### `GET /v1/roles`

Query params a soportar en el primer release:

- `page`
- `limit`
- `search`
- `scope`
- `status`
- `is_system`
- `sort[].field`
- `sort[].direction`

Sorts soportados:

- `name`
- `code`
- `status`
- `created_at`

Uso propuesto:

- `scope` y `is_system` no tienen que exponerse ambos de inicio como filtros visibles
- el primer release puede priorizar `search` y `status`, dejando `scope` e `is_system` como capacidad interna si hace falta

### Shape normalizado de rol en frontend

```ts
type RolePermission = {
  module: string;
  operation: string;
};

type RoleActorSummary = {
  userId: string;
  name: string | null;
  email: string | null;
};

type RoleListItem = {
  roleId: string;
  name: string;
  code: string;
  scope: 'MASTER_ADMIN' | 'ADMIN' | 'USER';
  isSystem: boolean;
  isImmutable: boolean;
  isDefault: boolean;
  statusId: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  permissions: RolePermission[];
  createdBy: RoleActorSummary | null;
  updatedBy: RoleActorSummary | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type RoleDetail = RoleListItem;
```

### `POST /v1/roles`

Payload desde frontend:

```ts
type CreateRolePayload = {
  name: string;
  permissions: RolePermission[];
};
```

Notas:

- frontend no envía `code`
- frontend no envía `scope`
- frontend no envía `isSystem`, `isDefault` o `isImmutable`
- esta iniciativa asume creación de roles custom mutables de scope `USER`

### `PATCH /v1/roles/:roleId`

Payload desde frontend:

```ts
type UpdateRolePayload = {
  permissions: RolePermission[];
};
```

Notas:

- según el contrato backend actual, la mutación ordinaria actualiza permisos
- el `name` no debe tratarse como editable mientras backend no lo soporte en este endpoint

### `PATCH /v1/roles/:roleId/status`

Payload desde frontend:

```ts
type ChangeRoleStatusPayload = {
  statusId: 'ACTIVE' | 'INACTIVE';
};
```

### `GET /v1/roles/modules`

Shape normalizado:

```ts
type RoleModuleCatalogItem = {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  moduleNameKey: string;
  statusId: string;
  isSystem: boolean;
};
```

### `GET /v1/roles/operations`

Shape normalizado:

```ts
type RoleOperationCatalogItem = {
  operationId: string;
  operationCode: string;
  operationName: string;
  operationNameKey: string;
  statusId: string;
  isSystem: boolean;
};
```

## State Changes

- crear `src/features/roles/types.ts`
- crear `src/features/roles/rolesThunks.ts`
- crear `src/features/roles/rolesSlice.ts`
- registrar el slice en el store global
- exponer helpers/selectors del módulo sin mezclar el estado de roles con `users`

## UI Behavior

- listado paginado con búsqueda, filtros básicos y acciones
- vista de detalle para inspección del rol y sus permisos
- formulario compartido de creación/edición
- editor de permisos agrupado por módulo
- acciones de status/delete visibles solo cuando la metadata real del rol lo permita

### Roles list

- tabla siguiendo el patrón actual del proyecto
- columnas mínimas:
  - `name`
  - `code`
  - `scope`
  - `status`
  - resumen corto de permisos o contador
  - `created_at`
  - acciones
- acciones por fila:
  - ver detalle
  - editar si el rol es mutable
  - cambiar status si el rol es mutable
  - eliminar si el rol es mutable

### Role detail

- vista solo lectura del rol
- mostrar metadata estructural:
  - `roleId`
  - `code`
  - `scope`
  - `status`
  - `isSystem`
  - `isDefault`
  - `isImmutable`
- mostrar permisos agrupados por módulo
- si el rol está protegido, mostrar claramente el estado bloqueado

### Role form

- componente compartido para create/edit
- sección general:
  - `name`
- sección de permisos:
  - una fila o bloque por módulo
  - chips togglables por operación
- el formulario debe serializar permisos activos a `Array<{ module, operation }>`
- el editor debe aplicar dependencia automática de `READ` por módulo

Regla de editor por módulo:

- activar `CREATE`, `UPDATE` o `DELETE` activa automáticamente `READ`
- `READ` no puede apagarse mientras exista otra operación activa en ese mismo módulo
- si `READ` es la única operación activa del módulo, sí puede apagarse
- la UI debe mostrar esta dependencia de forma clara, idealmente con hint o copy auxiliar

### Protected roles

- si backend devuelve roles protegidos, se muestran
- pueden verse en listado y detalle
- frontend no ofrece mutaciones ordinarias sobre ellos
- create/edit/status/delete deben ocultarse o deshabilitarse según corresponda

## Validation

- revisar permisos requeridos para mostrar el módulo y sus acciones
- verificar coherencia entre metadata del rol y acciones disponibles
- validar mensajes de error y estados vacíos

Permisos UI esperados:

- acceso al módulo: `ROLES/READ`
- crear: `ROLES/CREATE`
- editar o cambiar status: `ROLES/UPDATE`
- eliminar: `ROLES/DELETE`

Reglas:

- no mostrar el módulo a quien no tenga `ROLES/READ`
- no mostrar acciones de mutación si falta el permiso correspondiente
- aunque el permiso exista, no ofrecer mutaciones sobre roles protegidos

## Open Questions

- confirmar el conjunto exacto de filtros visibles del listado inicial
- confirmar si el sidebar expone el módulo desde el primer corte o después del listado básico
