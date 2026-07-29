# Analysis

## Initiative

- Name: `roles-permissions-frontend-refactor`
- Date: `2026-07-28`

## Current State

El frontend actual sigue fuertemente acoplado al modelo legacy de roles.

Hallazgos principales ya verificados:

- `AuthUser` sigue modelando `role` como enum legado
- existe `parseUserRole()` con fallback a roles antiguos
- existen utilidades de jerarquia fija como `canInviteRole()` y `canManageRole()`
- varias pantallas de usuarios y service entries usan `parseUserRole(authUser.role)`
- `usersThunks` y `authThunks` siguen consumiendo o derivando contratos legacy en varias rutas
- el backend ya expone un contrato principal basado en:
  - `system_role`
  - `role_id`
  - `GET /v1/auth/me/permissions`
  - `GET /v1/users/roles`
  - `GET /v1/roles*`

## Files Already Identified As Affected

- `src/features/auth/authThunks.ts`
- `src/features/auth/authSlice.ts`
- `src/features/auth/types.ts`
- `src/features/auth/persistence.ts`
- `src/features/users/roles.ts`
- `src/features/users/usersThunks.ts`
- `src/features/users/usersSlice.ts`
- `src/components/users2/*`
- `src/app/dashboard/users/*`
- `src/app/dashboard/users/invite/page.tsx`
- `src/app/public/user-register/page.tsx`
- `src/components/sidebar/AppSidebar.tsx`
- `src/components/serviceEntries/*`

## Backend Contracts Relevant To This Refactor

- `POST /v1/auth/login`
- `GET /v1/users/me`
- `GET /v1/auth/me/permissions`
- `GET /v1/users`
- `GET /v1/users/:userId`
- `PATCH /v1/users/:userId`
- `POST /v1/user-registration-invitations`
- `GET /v1/users/roles`
- `GET /v1/roles`
- `GET /v1/roles/:roleId`
- `GET /v1/roles/modules`
- `GET /v1/roles/operations`

## Risks

- romper auth al cambiar el shape persistido del usuario
- romper visibilidad de acciones en tablas y formularios
- dejar checks mezclados entre permisos nuevos y roles legacy
- propagar un modelo incorrecto si primero no se cierra la capa base de autorizacion frontend

## Constraints

- para esta iniciativa no se debe diseñar nada nuevo alrededor de enums legacy
- la compatibilidad temporal del backend no debe convertirse en dependencia permanente del frontend
- el trabajo debe poder continuar en sesiones futuras sin depender del chat actual
