# Analysis

## Current Frontend State

- La creacion de invitaciones ya vive en `/dashboard/users/invite`.
- El thunk actual `inviteUser` vive en `src/features/users/usersThunks.ts` y llama al endpoint `POST /v1/user-registration-invitations`.
- La navegacion ya modela `Usuarios` como una seccion administrativa con subitems para lista e invitacion.
- La visibilidad actual se basa en:
  - lectura de usuarios: `USERS/READ`
  - crear invitacion: `USER_REGISTRATION_INVITATIONS/CREATE`
- No existe una pantalla, slice, thunk ni ruta para administrar invitaciones ya emitidas.

## Reusable Frontend Patterns

- Feature state con Redux Toolkit: `slice` y `createAsyncThunk`.
- Listados con TanStack Table, estado de tabla aislado y query params sincronizados con la URL.
- Permisos en frontend mediante `useAuthorization().hasPermission(module, operation)`.
- Acciones condicionales por permiso y menu contextual por fila.
- Feedback mediante `useSnackbar` y dialogs de confirmacion para acciones destructivas.
- Localizacion mediante namespaces JSON en `src/locales/es` y `src/locales/en`.

## Integration Boundary

Esta spec integra exclusivamente la administracion de invitaciones de registro del scope de aplicacion.

Queda fuera:

- invitaciones y registro de `MASTER_ADMIN`
- expiracion de invitaciones
- reglas de negocio duplicadas en frontend
- manejo de capabilities auxiliares
- asociacion futura de usuarios con clientes
