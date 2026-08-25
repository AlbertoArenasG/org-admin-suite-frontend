# Implementation Breakdown

## Phase 1. Feature Foundation

- Status: `pending`
- Objective: aislar el recurso de invitaciones del estado de usuarios registrados.
- Files:
  - `src/features/user-registration-invitations/*`
  - `src/features/users/usersThunks.ts`
  - `src/store/store.ts`
  - `src/app/dashboard/users/invite/page.tsx`
- Exit criteria:
  - la creacion existente usa la nueva feature
  - `users` no conserva thunks de invitaciones
  - el estado de listado y mutaciones se registra correctamente

## Phase 2. Navigation And Localisation

- Status: `pending`
- Objective: exponer la nueva superficie solo a quien tenga la operacion correspondiente.
- Files:
  - `src/app/dashboard/users/invitations/page.tsx`
  - `src/components/sidebar/AppSidebar.tsx`
  - `src/lib/i18n.ts`
  - `src/locales/es/*`
  - `src/locales/en/*`
- Exit criteria:
  - existe la ruta y breadcrumbs
  - sidebar respeta la matriz de permisos aprobada
  - crear invitacion redirige al listado de invitaciones
  - todos los copies nuevos estan localizados

## Phase 3. Invitation List

- Status: `pending`
- Objective: entregar el listado administrativo consultable y compartible por URL.
- Files:
  - `src/components/user-registration-invitations/*`
  - `src/utils/userRegistrationInvitationsQuery.ts`
- Exit criteria:
  - datos, query params y paginacion sincronizados
  - columnas y estados visuales aprobados presentes
  - estados de carga, vacio, sin resultados y error resueltos

## Phase 4. Row Actions

- Status: `pending`
- Objective: operar reenvio y revocacion de forma segura y visible.
- Files:
  - `src/components/user-registration-invitations/*`
  - `src/features/user-registration-invitations/*`
- Exit criteria:
  - dialogs aprobados implementados
  - permisos y estado `PENDING` controlan acciones
  - fila se reconcilia con respuesta backend
  - `404`, `409` y fallo de proveedor se comunican correctamente

## Phase 5. Verification And Closure

- Status: `pending`
- Objective: verificar el flujo completo y cerrar la spec.
- Exit criteria:
  - lint y typecheck exitosos
  - validacion manual completada
  - todos los documentos de la spec y el indice quedan actualizados
