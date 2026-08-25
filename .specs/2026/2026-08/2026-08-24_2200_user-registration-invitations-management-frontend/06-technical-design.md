# Technical Design

## Status

- Design status: `approved`
- Ready for implementation breakdown

## Feature Boundary

Se agregara la feature:

- `src/features/user-registration-invitations`

Archivos previstos:

- `types.ts`
- `userRegistrationInvitationsSlice.ts`
- `userRegistrationInvitationsThunks.ts`
- `index.ts`

La feature concentrara las llamadas a:

- `POST /v1/user-registration-invitations`
- `GET /v1/user-registration-invitations`
- `POST /v1/user-registration-invitations/:invitationId/resend`
- `POST /v1/user-registration-invitations/:invitationId/revoke`

El reducer se registrara como:

- `state.userRegistrationInvitations`

El catalogo de roles disponible para crear invitaciones permanece en `features/users`:

- ya es usado por otros flujos de usuarios
- no representa estado propio de una invitacion
- evita duplicar la consulta `fetchUserRoles`

La creacion actual se mueve de `features/users/usersThunks.ts` a la nueva feature. `UserForm` y el endpoint no cambian.

## Data Contracts

Tipos base previstos:

```ts
type UserRegistrationInvitationStatus = 'PENDING' | 'CONSUMED' | 'REVOKED';
type InvitationDeliveryStatus = 'ACCEPTED' | 'FAILED' | null;
type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface UserRegistrationInvitation {
  invitationId: string;
  email: string;
  status: UserRegistrationInvitationStatus;
  statusName: string;
  systemRole: AuthSystemRole;
  systemRoleName: string;
  roleId: string | null;
  roleName: string | null;
  createdAt: string | null;
  consumedAt: string | null;
  revokedAt: string | null;
  emailDelivery: {
    lastAttemptAt: string | null;
    lastAttemptStatus: InvitationDeliveryStatus;
  };
  resendCount: number;
}
```

Los campos no utilizados por esta superficie, como `user_data`, IDs de actor y datos internos, no se trasladan al modelo de UI.

El mapeo API a camelCase se resuelve dentro de los thunks, siguiendo el patron de `contacts`.

## Redux State

```ts
interface UserRegistrationInvitationsState {
  list: {
    items: UserRegistrationInvitation[];
    status: RequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  mutations: {
    create: MutationState;
    resend: MutationState & { targetId: string | null };
    revoke: MutationState & { targetId: string | null };
  };
}
```

`resend` y `revoke` conservan un `targetId` independiente para que una accion en una fila no bloquee o desincronice otra fila.

Reglas:

- una mutacion exitosa reemplaza la fila por `invitationId`
- un `404` o `409` obliga a refrescar la consulta visible para reconciliar el estado
- si una respuesta deja de coincidir con el filtro `status` activo, el contenedor refresca la consulta en lugar de dejar una fila fuera de contexto
- el estado de consulta de tabla no se duplica en Redux

## Table State And URL

Se creara:

- `src/components/user-registration-invitations/useUserRegistrationInvitationsTableStore.ts`
- `src/utils/userRegistrationInvitationsQuery.ts`

El store Zustand contiene solo estado efimero de tabla:

- `pagination`
- `sorting`
- `columnVisibility`
- `globalFilter`
- `debouncedFilter`
- filtro `status`
- objetivo de reenvio y revocacion
- bandera `initialized`

La URL sera la fuente de verdad inicial y compartible:

```text
/dashboard/users/invitations?page=1&limit=10&search=...&status=PENDING&sort[0][field]=created_at&sort[0][direction]=desc
```

Mapeo de ordenamiento:

| Columna TanStack | Campo API    |
| ---------------- | ------------ |
| `status`         | `status`     |
| `createdAt`      | `created_at` |

Sin `sort[]`, el store usa `createdAt DESC`, alineado al default de backend.

## Components

Nueva carpeta:

- `src/components/user-registration-invitations`

Componentes previstos:

- `UserRegistrationInvitationsTableContainer`
- `UserRegistrationInvitationsDataTable`
- `UserRegistrationInvitationsTableToolbar`
- `useUserRegistrationInvitationsTableColumns`
- `useUserRegistrationInvitationsTableData`
- `UserRegistrationInvitationsTableRowActions`
- `ResendInvitationDialog`
- `RevokeInvitationDialog`
- `UserRegistrationInvitationsTableSkeleton`

La tabla sigue el patron de tablas administrativas existentes:

- TanStack Table
- MUI `Paper`, `Chip`, `Alert` y `LinearProgress`
- controles UI compartidos
- menu contextual de fila

La columna visual de ciclo de vida usa:

- composicion `Mail` + `Clock3` para `PENDING`
- `MailCheck` para `CONSUMED`
- `MailX` para `REVOKED`

`Ultimo envio` muestra:

- fecha/hora de ultimo intento, si existe
- `MailWarning` y copy de fallo si el proveedor devolvio `FAILED`
- copy neutro `Sin intentos registrados` para metadata historica ausente

## Permissions And Mutations

El contenedor consulta:

```ts
hasPermission('USER_REGISTRATION_INVITATIONS', 'READ');
hasPermission('USER_REGISTRATION_INVITATIONS', 'CREATE');
hasPermission('USER_REGISTRATION_INVITATIONS', 'RESEND');
hasPermission('USER_REGISTRATION_INVITATIONS', 'REVOKE');
```

Las acciones solo se habilitan cuando:

- la invitacion tiene `status === 'PENDING'`
- existe el permiso correspondiente

Flujo de mutacion:

1. usuario abre la accion desde el menu de fila
2. frontend abre el dialog de confirmacion aprobado
3. el thunk llama al endpoint sin body
4. mientras procesa, se deshabilita esa accion de esa fila
5. al exito, el slice sustituye la fila y el contenedor notifica con snackbar
6. ante `404` o `409`, el contenedor muestra feedback y refresca la consulta

## Routes And Create Flow

Se agregara:

- `src/app/dashboard/users/invitations/page.tsx`

La pagina renderiza el encabezado de dashboard, `PageBreadcrumbs` y el contenedor de tabla.

La navegacion agrega el subitem condicionado por `READ`.

Desde el listado, el CTA de crear enlaza a:

```text
/dashboard/users/invite
```

`InviteUserPage` no recibe ni evalua parametros de retorno. Al completar una invitacion redirige a `/dashboard/users/invitations`.

## Localisation

Se agregaran:

- `src/locales/es/userRegistrationInvitations.json`
- `src/locales/en/userRegistrationInvitations.json`

Se registraran en `src/lib/i18n.ts`.

Contendran:

- titulo, resumen y columnas
- estados, resultado de envio e indicadores
- filtros, busqueda, paginacion y columnas
- dialogs de reenvio y revocacion
- vacios, errores, reintentos y snackbars

`nav.json` y `breadcrumbs.json` reciben solo las etiquetas de navegacion correspondientes. `users.json` conserva los copies compartidos del formulario de invitacion.

## Validation Boundary

La implementacion debera validar manualmente:

- permisos independientes de lista, creacion, reenvio y revocacion
- URL con busqueda, filtro, orden y paginacion
- estados pendientes, consumidos, revocados y metadata historica ausente
- exito y fallo de reenvio
- revocacion y reconciliacion de filtros
- redireccion al listado de invitaciones tras crear invitacion
