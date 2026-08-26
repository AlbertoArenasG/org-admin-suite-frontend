# Technical Design

## Feature Boundaries

- `features/customers` incorpora el lookup reutilizable `GET /v1/customers/options` y el tipo compacto `CustomerOption`.
- `features/user-customer-relationships` concentra los tipos, thunks y estado Redux de la administracion contextual desde Clientes.
- `features/users` conserva el CRUD administrativo de usuarios; extiende su detalle con `customers` y su actualizacion con `customer_ids`.
- `features/user-registration-invitations` conserva el flujo de invitaciones; extiende creacion y detalle con `customer_ids` y `customers` respectivamente.

No se duplica estado relacional dentro de `customersSlice` ni `usersSlice`.

## Types

`features/customers` define los shapes compactos compartidos:

- `CustomerOption`: `{ id, companyName }`.
- `CustomerRelationshipSummary`: `{ id, companyName, status, statusName }`.

`features/users` extiende `User` con `systemRoleName` y agrega opcionalmente `customers: CustomerRelationshipSummary[]` solo en el detalle. `features/user-registration-invitations` aplica el mismo resumen solo al detalle de invitacion.

La feature relacional reutiliza `User` para el listado contextual y define `AvailableCustomerUser` como `{ id, name, lastname, fullName, email }` para el lookup de candidatos.

## Components

Se crean componentes aislados bajo `components/user-customer-relationships`:

- `CustomerMultiSelect`: selector reutilizable para invitaciones y edicion de usuarios.
- `RelatedCustomersSection`: resumen compacto reutilizable para detalles de invitacion y usuario.
- `CustomerUsersSection`: listado paginado y acciones contextuales dentro del detalle de Cliente.
- `CustomerUserLookupDialog`: lookup de candidatos y accion `Agregar usuario`.
- `RemoveCustomerUserDialog`: confirmacion de `Remover usuario`.

Los componentes de pagina solo orquestan datos de ruta, permisos funcionales directos y navegacion. No implementan contratos HTTP ni reglas de elegibilidad.

## Contracts And State

`features/customers` consulta opciones activas no paginadas mediante `GET /v1/customers/options`. El selector excluye localmente IDs ya elegidos y conserva las relaciones inactivas historicas como chips de solo lectura.

`features/user-customer-relationships` consume:

- `GET /v1/customers/:customerId/users` para el listado contextual paginado.
- `GET /v1/customers/:customerId/available-users` para candidatos elegibles.
- `POST /v1/customers/:customerId/users` para agregar un usuario.
- `DELETE /v1/customers/:customerId/users/:userId` para removerlo.

`customersSlice` conserva un estado cacheado `options` con `idle | loading | succeeded | failed`.

La feature relacional conserva estados separados para `relatedUsers`, `availableUsers`, `addUser` y `removeUser`. Tras agregar o remover, refresca solo el listado contextual; no modifica manualmente estados de `users` ni `customers`.

Los IDs del selector multiple viven en `react-hook-form`; no se persisten en Redux.

## Surface Data Flows

- Invitacion: al seleccionar un rol `USER`, carga opciones bajo demanda y envia `customer_ids`, incluido `[]`; para `ADMIN` omite el campo.
- Edicion de Usuario: carga el detalle y prepara Clientes activos seleccionables, mas relaciones inactivas existentes como chips de solo lectura. Al guardar, envia IDs activos e inactivos para conservar relaciones historicas.
- Detalles de Invitacion y Usuario: mapean `customers` directamente desde su respuesta administrativa, sin consultas adicionales.
- Detalle de Cliente: con `CUSTOMERS/READ`, carga el listado relacionado. El modal de candidatos se carga solo al abrirse. Tras agregar o remover, muestra feedback y refresca solo el listado contextual.
- Ante error `409` en una mutacion contextual, se refrescan listado y candidatos para resolver cambios concurrentes.

`customerIds` es el valor canonico del formulario. El selector agrega un ID solo si no existe y lo remueve mediante un nuevo arreglo filtrado; no mantiene una copia local paralela. Los chips inactivos conservan su ID en el valor canonico, no se pueden remover y se incluyen en el request de edicion. El cambio de rol a `ADMIN` limpia el arreglo antes de ocultar el control.

## Query State And Pagination

La lista general de Usuarios mantiene `customer_id` como fuente de verdad en la URL. `UsersTableContainer` lo obtiene de `searchParams`, lo envia a `fetchUsers` y lo preserva o elimina mediante `buildUserQuery`; no se agrega al store Zustand existente. Cambiar el Cliente fija `page=1` y conserva busqueda, orden y demas filtros.

La seccion `Usuarios relacionados` del detalle de Cliente mantiene pagina, busqueda y orden en estado local propio. No agrega parametros como `users_page` a la ruta del detalle. Reinicia pagina al buscar, ordenar, agregar o remover y consume los campos de orden permitidos por backend: `name`, `lastname`, `email`, `status`, `system_role` y `created_at`.

## Permissions

- La lectura contextual se muestra con `CUSTOMERS/READ`.
- `Agregar usuario` y `Remover usuario` se muestran solo con `CUSTOMERS/UPDATE` y Cliente activo.
- El selector de opciones de Clientes no evalua capabilities auxiliares en frontend. Backend autoriza `CUSTOMERS/READ_OPTIONS` derivada de `USERS` o `USER_REGISTRATION_INVITATIONS`.
- Los resumentes de Clientes en detalles no incluyen enlaces ni acciones, por lo que no requieren asumir `CUSTOMERS/READ`.

## Localization

Los nuevos copies viven en los namespaces que consumen cada superficie:

- `users`: selector, filtro y detalle de usuario.
- `userRegistrationInvitations`: detalle de invitacion.
- `customers`: seccion contextual, dialogos y feedback de mutaciones.

Los valores localizados entregados por backend (`status_name`, `system_role_name`) se pintan directamente.
