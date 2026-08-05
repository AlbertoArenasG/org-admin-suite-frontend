# Analysis

## Context

Backend ya cerró el rediseño del catálogo de autorización hacia un modelo por operaciones específicas por módulo.

Frontend todavía no tiene formalizada la iniciativa espejo para absorber ese cambio de manera integral.

## Fuente De Cambio

- backend source spec:
  - `org-admin-suite-api/.specs/2026/2026-08/2026-08-04_1600_authorization-catalog-module-specific-operations`

## Hallazgos Iniciales

- todavía no está aterrizada en una sola iniciativa la alineación completa de frontend con:
  - operaciones específicas por módulo
  - capacidades sensibles como `READ_PUBLIC_ACCESS`
  - salida de `POST /v1/users` del scope normal
- en `customers` y `providers` ya no aplica asumir que el permiso funcional `READ` incluye la visibilidad de datos de acceso público:
  - `public_access_url` y `public_access_token` salieron de los responses normales de listado y detalle
- esos datos ahora viven detrás de endpoints específicos
- esos endpoints dependen de una operación separada `READ_PUBLIC_ACCESS`

## Snapshot Del Contrato Backend Que Frontend Debe Asumir

### Catálogo de módulos y operaciones

- `GET /v1/roles/modules` es la fuente contractual para construir el editor de permisos
- el response ya devuelve cada módulo con sus `operations[]` anidadas, ordenadas y localizadas
- frontend no debe consumir ni reconstruir un catálogo separado de operaciones
- `GET /v1/roles/operations` debe tratarse como contrato obsoleto para esta iniciativa

### Estado actual del catálogo vivo

- `USERS`: `READ`, `UPDATE`, `DELETE`
- `ROLES`: `CREATE`, `READ`, `UPDATE`, `DELETE`
- `CUSTOMERS`: `CREATE`, `READ`, `READ_PUBLIC_ACCESS`, `UPDATE`, `DELETE`
- `PROVIDERS`: `CREATE`, `READ`, `READ_PUBLIC_ACCESS`, `UPDATE`, `DELETE`
- `SERVICE_ENTRIES`: `CREATE`, `READ`, `UPDATE`, `DELETE`
- `SERVICE_ENTRY_SURVEYS`: `READ`
- `SERVICE_PACKAGES`: `READ`, `DELETE`
- `USER_REGISTRATION_INVITATIONS`: `CREATE`

### Implicaciones inmediatas para frontend

- si una operación no viene en `operations[]`, frontend no debe renderizarla ni inferirla
- hoy backend todavía no publica `ROLES/ACTIVATE` en el catálogo vivo, por lo que frontend no debe asumir esa operación como disponible en esta spec hasta que el contrato real la exponga
- `POST /v1/users` salió del scope normal de negocio; el flujo funcional ordinario de alta de usuarios sigue viviendo en invitaciones
- el alta directa quedó reservada a `POST /v1/master-admin/users`, fuera del scope normal de frontend
- `GET /v1/users/roles` sigue absorbido por `USERS/READ` y devuelve los roles asignables reales con metadata útil para selects, incluyendo `role_id`, `role_name`, `system_role`, `role_scope`, `is_system` e `is_default`

### Capacidades sensibles ya separadas

- `GET /v1/customers/:customerId/public-access` depende de `CUSTOMERS/READ_PUBLIC_ACCESS`
- `GET /v1/providers/:providerId/public-access` depende de `PROVIDERS/READ_PUBLIC_ACCESS`
- el `READ` general de `customers` y `providers` ya no debe considerarse suficiente para exponer `public_access_url` ni `public_access_token`

## Superficies Probablemente Afectadas

- `src/app/dashboard/roles/*`
- `src/features/roles/*`
- componentes del editor de permisos de roles
- copy o hints del editor
- posibles consumers secundarios de permisos específicos
- docs frontend de integración si existen consumers activos de contratos afectados
- vistas autenticadas de `customers` y `providers` que en algún momento necesiten revelar o consumir acceso público sensible

## Resultado Del Audit Del Editor Actual

### Lo que ya está bien alineado

- frontend ya consume `GET /v1/roles/modules` desde `src/features/roles/rolesThunks.ts`
- el shape interno actual ya acepta operaciones dinámicas por módulo, sin cuadrícula CRUD hardcodeada
- `RolePermissionsEditor` renderiza `module.operations[]` tal como llegan del backend
- el detalle de rol también reutiliza el catálogo real para resolver nombres de módulos y operaciones

### Regla local de frontend aprobada

- `src/components/roles/roleFormUtils.ts` y `src/components/roles/RolePermissionsEditor.tsx` mantienen una semántica local donde:
  - si se activa cualquier operación distinta de `READ`, frontend activa `READ` automáticamente
  - mientras exista otra operación activa en el módulo, `READ` queda bloqueado y no puede desactivarse
- los copies de `src/locales/es/roles.json` y `src/locales/en/roles.json` ya enseñan esa regla como si fuera una verdad del sistema

### Implicación del hallazgo

- el editor ya no depende de CRUD uniforme
- frontend sí conserva una regla local deliberada de UX: cualquier operación distinta de `READ` implica `READ` para evitar errores humanos al crear o editar roles
- esa dependencia no necesita venir del catálogo backend como metadata separada mientras se mantenga solo como ayuda de captura en UI y no como reinterpretación del catálogo fuente

## Riesgos

- dejar frontend parcialmente alineado al nuevo catálogo backend
- sostener copy o comportamiento que aún presuponga CRUD uniforme
- reintroducir desde frontend la idea equivocada de que cualquier usuario con `READ` puede ver URLs o tokens de acceso público sensible
- perder la salvaguarda de UX que hoy evita omitir `READ` cuando se activa otra operación del mismo módulo

## Consumers Secundarios Identificados

### Authorization runtime de aplicación

- `src/features/auth/authThunks.ts` consume `GET /v1/auth/me/permissions`
- ese contrato alimenta:
  - `authorization.modules`
  - `authorization.permissions`
- `src/features/auth/useAuthorization.ts` expone `hasModule(...)` y `hasPermission(...)`
- la navegación y las superficies secundarias no consumen `GET /v1/roles/modules`; consumen autorización efectiva ya resuelta para el actor autenticado

### Navegación y dashboard

- `src/components/sidebar/AppSidebar.tsx` usa `hasModule(...)` y `hasPermission(...)` para construir navegación visible
- `src/app/dashboard/page.tsx` usa `hasModule(...)` y `hasPermission(...)` para quick actions y workspaces
- estas superficies no dependen del editor de roles, pero sí dependen de que frontend respete correctamente el catálogo/permiso efectivo que backend expone al usuario autenticado

### Superficies del propio módulo roles

- `src/components/roles/RolesTableContainer.tsx` usa `ROLES/READ`, `ROLES/CREATE`, `ROLES/UPDATE`, `ROLES/DELETE`
- `src/app/dashboard/roles/[roleId]/page.tsx` consume tanto `fetchRoleById(...)` como `fetchRoleModules(...)` para renderizar metadata y nombres de permisos
- el detalle de roles sí es consumer secundario del catálogo de módulos porque usa ese catálogo para resolver labels humanos de permisos persistidos

### Conclusión del mapa de consumers

- el rediseño impacta dos planos distintos:
  - catálogo editable del módulo `roles`
  - autorización efectiva del usuario autenticado en `auth/me/permissions`
- para esta spec no basta con revisar el editor; también hay que vigilar que ninguna superficie secundaria siga asumiendo operaciones uniformes o endpoints ya retirados del scope normal

## Criterio De Inicio

Antes de tocar código conviene cerrar:

- alcance exacto del cambio frontend
- forma deseada de representar operaciones específicas o sensibles en la UI
- alcance exacto de los consumers que deberán migrar de `READ` hacia `READ_PUBLIC_ACCESS` en `customers` y `providers`
