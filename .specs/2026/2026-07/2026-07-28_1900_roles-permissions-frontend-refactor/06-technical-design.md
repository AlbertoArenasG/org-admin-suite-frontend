# Technical Design

## Scope

Esta iniciativa cubre:

- autenticacion y shape del usuario autenticado
- permisos efectivos y visibilidad de UI
- CRUD de usuarios
- invitaciones de usuario y registro publico asociado
- navegacion dependiente de permisos o modulos

No cubre en esta fase:

- rediseño visual del dashboard
- nuevos modulos de backend
- una experiencia exclusiva de plataforma en frontend

## Target Frontend Model

### Auth User

Modelo objetivo aprobado:

- `id`
- `email`
- `name`
- `lastname`
- `systemRole`
- `roleId`
- `status`
- `cellPhone`

### Auth Permission Context

Modelo objetivo aprobado:

- `role`
  - `id`
  - `code`
  - `name`
  - `scope`
  - `isSystem`
  - `isDefault`
  - `isImmutable`
  - `status`
- `modules`
  - `code`
  - `name`
  - `nameKey`
- `permissions`
  - `module`
  - `operation`
  - `moduleName`
  - `moduleNameKey`
  - `operationName`
  - `operationNameKey`

## Auth State Shape

La forma objetivo del slice `auth` debe separar identidad y autorizacion:

```ts
type AuthState = {
  user: AuthUser | null;
  authorization: AuthAuthorization | null;
  token: string | null;
  hydrated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  successMessage: string | null;
};
```

Donde:

```ts
type AuthUser = {
  id: string;
  email: string;
  name: string;
  lastname: string;
  systemRole: 'MASTER_ADMIN' | 'ADMIN' | 'USER';
  roleId: string | null;
  status: string;
  cellPhone: {
    countryCode: string;
    number: string;
  } | null;
};
```

Y:

```ts
type AuthAuthorization = {
  role: {
    id: string;
    code: string;
    name: string;
    scope: string;
    isSystem: boolean;
    isDefault: boolean;
    isImmutable: boolean;
    status: string;
  } | null;
  modules: Array<{
    code: string;
    name: string;
    nameKey: string;
  }>;
  permissions: Array<{
    module: string;
    moduleName: string;
    moduleNameKey: string;
    operation: string;
    operationName: string;
    operationNameKey: string;
  }>;
};
```

## Backend Contract Mapping

### `POST /v1/auth/login`

Consumido para:

- obtener `token`
- construir `auth.user`

Campos usados:

- `access_token`
- `user.id`
- `user.name`
- `user.lastname`
- `user.email`
- `user.system_role`
- `user.role_id`
- `user.status`
- `user.cell_phone`

### `GET /v1/users/me`

Consumido para:

- reconstruir o refrescar `auth.user` en hidratacion de sesion

### `GET /v1/auth/me/permissions`

Consumido para:

- poblar `auth.authorization.role`
- poblar `auth.authorization.modules`
- poblar `auth.authorization.permissions`

Es la fuente principal para:

- sidebar
- checks de UI
- visibilidad de acciones finas

### `GET /v1/users/roles`

Consumido para:

- lista de roles asignables en alta, edicion e invitacion de usuarios

Regla:

- `role_id` se trata como identificador canónico del rol
- `role_scope` se trata como metadata funcional
- no se convierte a enums legacy

### `GET /v1/roles*`

Consumido para:

- futura gestion de roles custom
- posible CRUD o detalle de roles en frontend

El modelo interno debe quedar listo para consumir estos endpoints sin introducir deuda nueva.

## Data Loading Strategy

### Auth Layer

- adaptar `authThunks` para consumir login y perfil con `system_role` + `role_id`
- extender la hidratacion para soportar metadata de permisos
- cargar `GET /v1/auth/me/permissions`:
  - despues de login exitoso
  - despues de hidratar una sesion persistida con token valido

Secuencia objetivo:

1. login o hidratacion recuperan `token` y `user`
2. frontend consulta `GET /v1/auth/me/permissions`
3. frontend guarda `authorization` en `auth.authorization`

Si falla `me/permissions`:

- la sesion no debe considerarse completamente lista para UI autorizada
- el estado de error debe quedar visible para manejo controlado

### Hydration Strategy

Persistencia local objetivo:

- persistir `token`
- persistir `user`

No persistir como fuente principal:

- `authorization`

Razon:

- `authorization` depende del estado actual del backend
- mantenerla fuera del storage reduce riesgo de UI obsoleta si cambian permisos del usuario

Secuencia objetivo de hidratacion:

1. leer `token` y `user` desde storage
2. poblar `auth.user` y `auth.token`
3. mantener la sesion como no lista para UI autorizada hasta resolver permisos
4. consultar `GET /v1/auth/me/permissions`
5. poblar `auth.authorization`
6. marcar la sesion como completamente hidratada

Comportamiento ante `401`:

- limpiar `token`
- limpiar `user`
- limpiar `authorization`
- redirigir a login

Comportamiento ante error no `401` en `me/permissions`:

- mantener temporalmente `token` y `user`
- exponer error de autorizacion
- evitar renderizar UI dependiente de permisos como si estuviera lista

## State Transition Rules

### Login Success

- guardar `token`
- guardar `user`
- limpiar errores previos
- resolver `me/permissions`
- guardar `authorization`

### Login Failure

- limpiar `token`
- limpiar `user`
- limpiar `authorization`
- persistir estado limpio

### Logout

- limpiar `token`
- limpiar `user`
- limpiar `authorization`
- limpiar storage local

### Session Refresh Or Rehydration

- si hay `token` sin `user`, intentar reconstruir `user` via `GET /v1/users/me`
- si hay `token` y `user`, resolver de todos modos `me/permissions`
- si alguno de los endpoints clave devuelve `401`, invalidar sesion

## Selectors And Helpers

Selectors objetivo:

- `selectAuthUser`
- `selectAuthAuthorization`
- `selectAuthModules`
- `selectAuthPermissions`
- `selectIsAuthHydrated`
- `selectHasAuthorizationLoaded`
- `selectAuthStatus`

Derivados objetivo:

- `selectModuleCodesSet`
- `selectPermissionKeysSet`

Helpers objetivo:

- `buildPermissionKey(moduleCode, operationCode)`
- `hasModule(modules, moduleCode)`
- `hasPermission(permissions, moduleCode, operationCode)`

Hook objetivo:

- `useAuthorization()`

API minima esperada del hook:

```ts
{
  authorization: AuthAuthorization | null;
  hasModule: (code: string) => boolean;
  hasPermission: (module: string, operation: string) => boolean;
  isReady: boolean;
}
```

## Authorization Consumption Layer

Crear una capa comun reusable, por ejemplo:

- helper `hasPermission(module, operation)`
- helper `hasModule(code)`
- hook `useAuthorization()`
- selector `selectAuthorization`
- selector `selectModuleCodes`
- selector `selectPermissionKeys`

Esa capa no debe depender de enums legacy.

### Store Rule

`modules` y `permissions` viven como arrays planos dentro del store.

Los lookups optimizados se derivan fuera del store, por ejemplo:

- `Set<string>` de modulos
- `Set<string>` de permisos tipo `MODULE:OPERATION`

## Navigation Model

### Sidebar

Reglas aprobadas:

- `Dashboard` es una entry transversal del frontend para usuarios autenticados
- los items de negocio del sidebar se muestran por `modules`
- subitems o acciones mas finas pueden depender de `permissions`

Ejemplo conceptual:

- mostrar `Users` si existe modulo `USERS`
- mostrar `Roles` si existe modulo `ROLES`
- mostrar CTA o acciones secundarias segun permisos concretos

Regla operativa:

- los items top-level del sidebar deben tener visibilidad basada en `modules`
- los subitems opcionales pueden refinarse por `permissions`
- la config de navegacion debe centralizarse y no quedar dispersa en JSX

### Dashboard

Reglas aprobadas:

- `dashboard` no se modela como modulo de backend
- `dashboard` no depende de permiso artificial
- el contenido interno del dashboard se compone dinamicamente segun acceso real
- si un usuario autenticado tiene acceso muy limitado, el dashboard debe degradar a estado vacio o reducido

Regla operativa:

- el dashboard debe componerse por bloques o widgets condicionados por `modules` y `permissions`
- la variacion futura entre dashboards por usuario debe resolverse dentro de esa composicion

## User Flows Affected

### Structural Management Rule For Users

Regla vigente del modelo actual:

- la gestion de otros usuarios no depende solo de permisos funcionales
- tambien depende de jerarquia estructural por `systemRole`

Jerarquia estructural vigente:

- `MASTER_ADMIN`
- `ADMIN`
- `USER`

Regla vigente para management de otro usuario existente:

- `MASTER_ADMIN` puede gestionar `ADMIN` y `USER`
- `ADMIN` puede gestionar `USER`
- `USER` no puede gestionar a otro `USER`

Notas:

- esta regla aplica a management de otro usuario existente
- no aplica a self-service del propio perfil
- aunque un `USER` tenga permisos funcionales de `USERS/UPDATE` o `USERS/DELETE`, hoy no debe poder editar o eliminar a otro `USER` dentro del alcance de esta iniciativa
- cualquier cambio futuro a esta política debe tratarse como iniciativa posterior de backend y frontend, no como parte de esta spec actual

### User List / Detail / Edit

- dejan de leer `role` como contrato principal
- deben trabajar con `systemRole`, `roleId` y metadata de roles asignables
- las restricciones visuales ya no deben depender de `canManageRole()` legacy

### Invite User

- debe enviar `system_role`
- debe enviar `role_id`
- debe poblar sus opciones desde `GET /v1/users/roles`

### Public User Register

- debe dejar de tratar `role` y `role_name` como base semantica del flujo
- puede mostrar metadata descriptiva si el backend la expone, pero la logica principal debe sostenerse en `system_role` y `role_id`

## User Management Layer

- `GET /v1/users/roles` debe consumirse como lista real de roles asignables
- no se debe mapear `role_id` hacia enums legacy
- `system_role` y `role_id` deben manejarse explícitamente en forms y updates

## Screens And Modules Initially Affected

- login
- dashboard users list
- user detail
- user edit
- invite user
- public user register
- sidebar

## File Targets By Phase

### Auth And Permission Foundation

- `src/features/auth/types.ts`
- `src/features/auth/authSlice.ts`
- `src/features/auth/authThunks.ts`
- `src/features/auth/persistence.ts`
- `src/components/auth/AuthGuard.tsx`

### Authorization Consumption

- nueva capa en `src/features/auth/*` o `src/lib/*`
- `src/components/sidebar/*`
- consumidores tempranos de permisos en auth y navegación

### Users And Invitations

- `src/features/users/usersThunks.ts`
- `src/features/users/usersSlice.ts`
- `src/features/users/roles.ts`
- `src/components/users2/*`
- `src/app/dashboard/users/*`
- `src/app/public/user-register/page.tsx`

### Remaining UI

- `src/components/serviceEntries/*`
- cualquier otro consumidor de `parseUserRole()` o ranking legacy

## Legacy Removal Targets

Esta iniciativa debe eliminar gradualmente dependencias a:

- `parseUserRole()`
- `canInviteRole()`
- `canManageRole()`
- `USER_ROLE_LIST`
- modelado legacy de `AuthUser.role`
- normalizacion de `role_id` contra enums legacy

## Validation Strategy

- validar login e hidratacion
- validar carga de `me/permissions`
- validar visibilidad de sidebar
- validar listado de usuarios
- validar editar usuario
- validar invitar usuario
- validar registro publico desde invitacion

## Done Criteria By Major Phase

### Auth And Permission Foundation

- `auth.user` ya no depende de `role` legacy
- `auth.authorization` existe y se carga con `me/permissions`
- existe al menos una capa reusable de selectors/helpers

### Users And Invitations

- forms y tablas ya trabajan con `systemRole` y `roleId`
- roles asignables ya no se normalizan a enums legacy

### Navigation And Remaining UI

- sidebar top-level ya depende de `modules`
- no quedan checks funcionales principales basados en `parseUserRole()`

## Open Questions

- que checks de UI deben seguir dependiendo de `systemRole` por ser estructurales y no funcionales

Actualmente no hay ninguna regla estructural exclusiva de plataforma en frontend, asi que esta pregunta queda abierta solo como previsión futura, no como blocker actual.
