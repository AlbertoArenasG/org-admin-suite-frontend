# Technical Design

## Scope

- módulo de roles dentro del dashboard autenticado
- listado, detalle, creación, edición, cambio de status y delete
- consumo de catálogos de módulos y operaciones

## Contracts

- `GET /v1/roles`
- `GET /v1/roles/:roleId`
- `POST /v1/roles`
- `PATCH /v1/roles/:roleId`
- `PATCH /v1/roles/:roleId/status`
- `DELETE /v1/roles/:roleId`
- `GET /v1/roles/modules`
- `GET /v1/roles/operations`

## State Changes

- crear `src/features/roles/types.ts`
- crear `src/features/roles/rolesThunks.ts`
- crear `src/features/roles/rolesSlice.ts`
- registrar el slice en el store global

## UI Behavior

- listado paginado con búsqueda, filtros básicos y acciones
- vista de detalle para inspección del rol y sus permisos
- formulario compartido de creación/edición
- editor de permisos agrupado por módulo
- acciones de status/delete visibles solo cuando la metadata real del rol lo permita

## Validation

- revisar permisos requeridos para mostrar el módulo y sus acciones
- verificar coherencia entre metadata del rol y acciones disponibles
- validar mensajes de error y estados vacíos

## Open Questions

- confirmar el conjunto exacto de filtros del listado inicial
- confirmar si el módulo se expone desde sidebar de inicio o detrás de una fase posterior de navegación
