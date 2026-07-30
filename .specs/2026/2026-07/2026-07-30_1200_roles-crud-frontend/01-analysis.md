# Analysis

## Current State

- el backend ya expone:
  - `GET /v1/roles`
  - `GET /v1/roles/:roleId`
  - `POST /v1/roles`
  - `PATCH /v1/roles/:roleId`
  - `PATCH /v1/roles/:roleId/status`
  - `DELETE /v1/roles/:roleId`
  - `GET /v1/roles/modules`
  - `GET /v1/roles/operations`
- el frontend ya tiene resuelta la base de auth/autorización necesaria para proteger el módulo por permisos reales
- no existe todavía un feature dedicado de roles en `src/features/*`
- tampoco existe aún una navegación visible hacia el módulo de roles en el dashboard/sidebar

## Relevant Backend Inputs

- `docs/frontend/roles-permissions-refactor-handoff.md`
- spec cerrada de backend:
  - `org-admin-suite-api/.specs/2026/2026-05/2026-05-26_1940_roles-permissions-refactor`

## Relevant Frontend Inputs

- spec cerrada de frontend:
  - `org-admin-suite-frontend/.specs/2026/2026-07/2026-07-28_1900_roles-permissions-frontend-refactor`
- capa reusable de autorización ya disponible en:
  - `src/features/auth/*`
- patrones de CRUD ya existentes en:
  - `src/features/users/*`
  - `src/features/customers/*`
  - `src/features/providers/*`

## Main Risks

- diseñar una UI de permisos difícil de mantener o demasiado acoplada a strings
- duplicar reglas del backend sobre roles protegidos
- mezclar estado local y global del módulo sin una frontera clara
- introducir navegación del módulo antes de cerrar permisos y visibilidad

## Out Of Scope For This Initiative

- cambios al backend del módulo de roles
- redefinir el catálogo de permisos o módulos
- cambiar la jerarquía estructural de `systemRole`
- rediseñar auth o autorización base del frontend
