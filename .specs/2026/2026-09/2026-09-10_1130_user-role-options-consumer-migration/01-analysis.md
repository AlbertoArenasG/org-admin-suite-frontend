# Análisis

## Consumidores actuales

| Flujo            | Ruta                             | Thunk actual             | Estado compartido   |
| ---------------- | -------------------------------- | ------------------------ | ------------------- |
| Invitación       | `/dashboard/users/invite`        | `fetchUserRoles`         | `state.users.roles` |
| Creación directa | `/dashboard/users/create`        | `fetchUserCreationRoles` | `state.users.roles` |
| Edición          | `/dashboard/users/[userId]/edit` | `fetchUserRoles`         | `state.users.roles` |

Ambos thunks realizan el mismo parsing de `ApiUserRole` hacia `UserRoleInfo`.
El slice duplica seis reducers para los mismos estados `pending`, `fulfilled` y
`rejected`.

## Contrato remoto aprobado

`GET /v1/roles/options` conserva el arreglo actual de opciones:

- `role_id`
- `role_code`
- `role_name`
- `system_role`
- `role_scope`
- `is_system`
- `is_default`

No recibe parámetros y no responde `pagination`. Backend determina las
opciones por `systemRole` del actor; frontend no reproduce ese filtro como
regla de autorización.

## Deuda de formularios relacionada

`UserForm` y `UserFormValues` transportan `password` y `confirmPassword` en
invitación y edición aunque esos flujos no los renderizan ni los serializan.
La deuda no afecta el contrato HTTP actual, pero mezcla tres intenciones de
producto en un componente y tipo compartidos.

## Riesgos de migración

- El estado único `state.users.roles` puede contener una carga anterior;
  cada pantalla debe conservar sus estados de loading y error actuales al usar
  el thunk unificado.
- La edición debe dejar de requerir indirectamente permiso de invitación, pero
  su visibilidad y submit siguen gobernados por `USERS/UPDATE`.
- No se debe trasladar `ROLES/READ_OPTIONS` a `useAuthorization`: capabilities
  auxiliares son una responsabilidad de backend.

## Fuentes revisadas

- `src/features/users/usersThunks.ts`
- `src/features/users/usersSlice.ts`
- `src/app/dashboard/users/invite/page.tsx`
- `src/app/dashboard/users/create/page.tsx`
- `src/app/dashboard/users/[userId]/edit/page.tsx`
- `src/components/users2/UserForm.tsx`
- `docs/technical-debt/user-role-assignment-options/role-options-capability-inconsistency.md`
- `docs/technical-debt/user-form-boundary/user-form-flow-coupling.md`
- Spec backend `role-options-auxiliary-capability` cerrada el 10 de septiembre de 2026.
