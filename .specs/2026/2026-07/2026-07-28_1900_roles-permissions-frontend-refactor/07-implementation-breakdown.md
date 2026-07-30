# Implementation Breakdown

## Slice 1. Auth Model

### Objective

Migrar la base de sesion autenticada para que el frontend opere con `auth.user` y `auth.authorization` sin depender de `role` legacy como contrato principal.

### Files

- `src/features/auth/types.ts`
- `src/features/auth/authSlice.ts`
- `src/features/auth/authThunks.ts`
- `src/features/auth/persistence.ts`
- `src/components/auth/AuthGuard.tsx`

### Microphases

#### Slice 1.1. Redefinir tipos de auth

- introducir `AuthUser` nuevo
- introducir `AuthAuthorization`
- ajustar `AuthState`

Done when:

- los tipos de auth ya representan `user` y `authorization` separados
- `role` legacy deja de ser obligatorio en `AuthUser`

#### Slice 1.2. Adaptar mappers de login y `me`

- mapear `system_role` -> `systemRole`
- mapear `role_id` -> `roleId`
- dejar de depender de `parseUserRole()` en auth

Done when:

- login y fetch de perfil ya construyen `AuthUser` nuevo

#### Slice 1.3. Adaptar `authSlice`

- almacenar `authorization` como subbloque
- limpiar `authorization` en login fallido, logout y errores invalidantes
- ajustar reducers de hidratacion

Done when:

- `authSlice` ya soporta `auth.authorization`

#### Slice 1.4. Redefinir persistencia local

- persistir solo `token` y `user`
- dejar fuera `authorization` como fuente persistida
- limpiar storage completo en `401` o logout

Done when:

- la sesion se puede hidratar sin persistir permisos

#### Slice 1.5. Cargar `me/permissions`

- agregar thunk o flujo dedicado
- dispararlo despues de login y despues de hidratacion
- modelar comportamiento si falla

Done when:

- el frontend puede poblar `auth.authorization` desde backend

### Risks

- romper el flujo actual de hidratacion
- dejar estados intermedios donde hay `user` sin `authorization`

### Guardrails

- no introducir compatibilidad nueva basada en `role`
- no persistir `authorization` en storage

## Slice 2. Authorization Helpers

### Objective

Crear la capa comun de consumo de autorizacion para que la UI no dependa de arrays crudos ni de helpers legacy.

### Files

- nueva capa en `src/features/auth/*` o `src/lib/*`
- consumidores iniciales en sidebar y auth

### Microphases

#### Slice 2.1. Selectors base

- `selectAuthAuthorization`
- `selectAuthModules`
- `selectAuthPermissions`
- `selectHasAuthorizationLoaded`

#### Slice 2.2. Derivados optimizados

- `selectModuleCodesSet`
- `selectPermissionKeysSet`
- `buildPermissionKey`

#### Slice 2.3. Helpers o hook reusable

- `hasModule`
- `hasPermission`
- `useAuthorization`

#### Slice 2.4. Primeros consumidores

- adaptar `AuthGuard` o capas cercanas si necesitan estado de readiness
- dejar la API lista para sidebar y pantallas

Done when:

- existe una API reutilizable para checks por modulo y permiso
- no hace falta usar `.some(...)` manual por toda la app

### Risks

- dispersar lógica entre selectors y helpers sin frontera clara

### Guardrails

- mantener el estado fuente plano
- no guardar `Set` ni `Map` en Redux
- no introducir helpers acoplados a nombres de pantallas

## Slice 3. Users

### Objective

Migrar el dominio de usuarios al contrato nuevo basado en `systemRole`, `roleId` y roles asignables reales.

### Files

- `src/features/users/usersThunks.ts`
- `src/features/users/usersSlice.ts`
- `src/features/users/roles.ts`
- `src/components/users2/*`
- `src/app/dashboard/users/*`

### Microphases

#### Slice 3.1. Redefinir tipos de usuario en frontend

- eliminar dependencia conceptual a `UserRole` legacy en entidades principales
- ajustar `UserRoleInfo` y datos de tabla

#### Slice 3.2. Migrar fetch/list/detail/update

- consumir `system_role`
- consumir `role_id`
- dejar de leer `role_name` como fuente principal

#### Slice 3.3. Migrar roles asignables

- consumir `GET /v1/users/roles` como catálogo real
- manejar `role_scope`, `is_system`, `is_default`
- dejar de normalizar a enums legacy

#### Slice 3.4. Migrar restricciones visuales de usuarios

- reemplazar `canManageRole()` y similares
- mover la lógica hacia reglas basadas en `systemRole`, metadata real del rol o permisos

Done when:

- alta, edición, detalle y listado ya no dependen de parseo legacy
- el usuario puede elegir roles asignables reales desde backend

### Risks

- dejar parte del flujo usando `UserRole` legacy por inercia tipada

### Guardrails

- no volver a tipar `roleId` como enum fijo
- no usar `parseUserRole()` para mapear `GET /v1/users/roles`

## Slice 4. Invitations

### Objective

Migrar invitaciones y registro publico asociado al nuevo modelo de `systemRole` y `roleId`.

### Files

- `src/app/dashboard/users/invite/page.tsx`
- `src/features/users/usersThunks.ts`
- `src/app/public/user-register/page.tsx`

### Microphases

#### Slice 4.1. Invite user

- enviar `system_role`
- enviar `role_id`
- poblar opciones desde roles asignables reales

#### Slice 4.2. Public register intake

- dejar de tratar `role` y `role_name` como base semantica del flujo
- usar `system_role` y `role_id` como contrato principal

#### Slice 4.3. Post-registration login path

- asegurar que el autologin al completar registro ya soporte el nuevo `AuthUser`

Done when:

- la invitacion y el registro ya no dependen del modelo legacy como base principal
- `user-register` consume la invitacion usando `system_role` y `role_id` como contrato principal

### Risks

- mantener copy o UI basados en nombres legacy aunque el flujo ya haya migrado

### Guardrails

- se puede mostrar metadata descriptiva legacy solo si no define la lógica

## Slice 5. Navigation And Dashboard

### Objective

Migrar la navegacion principal para que dependa de `modules` y preparar el dashboard como vista transversal dinámica.

### Files

- `src/components/sidebar/AppSidebar.tsx`
- `src/components/sidebar/NavMain.tsx`
- `src/app/dashboard/page.tsx`
- componentes auxiliares de dashboard

### Microphases

#### Slice 5.1. Config de navegación

- definir visibilidad de entries top-level por `modules`
- refinar subitems por `permissions` cuando haga falta

#### Slice 5.2. Migrar sidebar

- reemplazar dependencias legacy
- consumir selectors/helpers de autorizacion

#### Slice 5.3. Dashboard composition

- definir bloques visibles por acceso
- preparar degradación a estado vacío o reducido

Done when:

- el sidebar ya depende de `modules`
- dashboard ya no se trata como modulo backend

### Risks

- dejar lógica de visibilidad mezclada directamente en JSX

### Guardrails

- centralizar la config de navegación
- no inventar permiso artificial `DASHBOARD/*`

## Slice 6. Remaining UI And Cleanup

### Objective

Eliminar dependencias legacy residuales y alinear módulos secundarios con la nueva capa de autorización.

### Files

- `src/components/serviceEntries/*`
- cualquier otro consumidor de `parseUserRole()`
- archivos legacy en `src/features/users/roles.ts` o equivalentes

### Microphases

#### Slice 6.1. Migrar consumidores residuales

- service entries
- row actions
- forms
- guards visuales dispersos

#### Slice 6.2. Eliminar helpers legacy

- `parseUserRole()`
- `canInviteRole()`
- `canManageRole()`
- listas fijas de roles ya obsoletas

#### Slice 6.3. Cleanup final del estado

- remover campos, mappers y compatibilidad innecesaria en frontend
- alinear docs si cambia algo respecto al diseño aprobado

Done when:

- no quedan checks funcionales relevantes sobre enums legacy
- el frontend puede mantenerse sin reintroducir esa deuda

### Risks

- olvidar consumidores secundarios fuera del dominio users

### Guardrails

- buscar por referencias reales antes de cerrar el slice
- no marcar el slice como completo mientras existan puntos activos de `parseUserRole()`

## Estado Actual

- `Slice 1` a `Slice 6` quedaron implementados en código según la auditoría del `2026-07-30`.
- No se detectaron consumidores funcionales activos del modelo legacy dentro del alcance directo de esta iniciativa.
- La validación funcional final de rutas, auth y acciones principales quedó registrada como completada.
- La iniciativa quedó formalmente cerrada el `2026-07-30`.
