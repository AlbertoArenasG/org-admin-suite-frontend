# Implementation Breakdown

## Slice 1. Contratos Compartidos Y Lookup De Clientes

Objetivo: incorporar los tipos y la consulta reutilizable de opciones activas sin tocar aun formularios o pantallas.

Estado: completed.

- Agregar `CustomerOption` y `CustomerRelationshipSummary` a `features/customers`.
- Agregar el estado `options` y el thunk para `GET /v1/customers/options` en la feature de Clientes.
- Extender el mapeo y tipos de `User` con `systemRoleName` y `customers` solo para detalle.
- Extender los tipos de detalle de invitacion con `customers`.
- Verificar que todos los IDs del resumen usan `customer_id` en API y `id` internamente en frontend.

Implementado con el contrato de backend corregido para que el detalle de Usuario emita `customers[].customer_id`.

## Slice 2. Selector Reutilizable Y Formularios

Objetivo: permitir seleccionar Clientes en invitaciones y edicion de usuarios sin duplicar estado.

Estado: completed.

- Crear `CustomerMultiSelect` bajo `components/user-customer-relationships`.
- Extender `UserForm` con `customerIds` y relaciones inactivas de solo lectura.
- Integrar el selector en creacion de invitacion y enviar `customer_ids` solo para `USER`.
- Integrar el selector en edicion de Usuario y preservar relaciones inactivas existentes en el payload.
- Centralizar copies ES/EN para etiqueta, ayuda, busqueda, chips y estados de carga/error.

Implementado con `customerIds` como campo canonico de React Hook Form. El lookup se solicita solo al seleccionar un rol `USER`; al cambiar a otro rol se limpian las relaciones y el payload omite `customer_ids`. Las relaciones historicas de Clientes inactivos se mantienen como chips de solo lectura y se preservan al guardar.

## Slice 3. Detalles Administrativos

Objetivo: mostrar resumentes de Clientes sin cargar datos extra ni agregar enlaces no autorizados.

Estado: completed.

- Crear `RelatedCustomersSection` reutilizable.
- Integrarlo en el detalle de Usuario a partir de `GET /v1/users/:userId`.
- Crear el detalle administrativo de Invitacion en `/dashboard/users/invitations/[invitationId]`.
- Integrar la misma seccion con el detalle de invitacion y enlazarlo desde las acciones de su tabla.
- Implementar estados de carga, error y vacio localizados.

Implementado con `RelatedCustomersSection` como componente presentacional comun. El detalle de Invitacion usa su propio thunk y estado Redux contra `GET /v1/user-registration-invitations/:invitationId`; el detalle de Usuario reutiliza los datos ya obtenidos en su endpoint. Ninguna relacion agrega enlaces o requiere permisos de Clientes.

## Slice 4. Filtro De Cliente En Usuarios

Objetivo: filtrar el listado general por Cliente manteniendo la URL como fuente de verdad.

Estado: completed.

- Extender `FetchUsersParams` y el thunk con `customerId`.
- Adaptar `UsersTableContainer`, `UsersTableToolbar` y `usersQuery` para leer, escribir y eliminar `customer_id`.
- Agregar el selector simple `Cliente` con placeholder `Filtrar por cliente`.
- Reiniciar pagina al cambiar el filtro y conservar busqueda, orden y demas parametros.
- Presentar el estado vacio especifico cuando el filtro esta activo.

Implementado con el parametro `customer_id` leido directamente desde la URL, sin estado adicional en Zustand. El selector carga el lookup de Clientes activo y al cambiar o limpiar el filtro reinicia la pagina, preservando busqueda, ordenamiento y demas parametros.

## Slice 5. Administracion Contextual Desde Clientes

Objetivo: administrar usuarios desde el detalle de un Cliente mediante endpoints contextuales y permisos de Clientes.

Estado: completed.

- Crear `features/user-customer-relationships` con thunks, slice y tipos para listado, candidatos y mutaciones.
- Crear `CustomerUsersSection`, `CustomerUserLookupDialog` y `RemoveCustomerUserDialog`.
- Integrar la seccion al detalle de Cliente.
- Condicionar lectura y mutaciones a `CUSTOMERS/READ`, `CUSTOMERS/UPDATE` y Cliente activo.
- Refrescar listado tras mutacion; ante `409`, refrescar listado y candidatos.
- Mantener pagina, busqueda y orden como estado local de la seccion.

Implementado en una feature Redux aislada de Usuarios y Clientes. La seccion contextual usa los endpoints anidados, conserva pagina, busqueda y orden localmente, y solo habilita mutaciones con `CUSTOMERS/UPDATE` sobre Clientes `ACTIVE`. Las respuestas `409` fuerzan la reconciliacion de lista y candidatos.

## Slice 6. Verificacion Y Cierre

Objetivo: comprobar contratos, permisos, localizacion y regresiones visibles.

Estado: completed.

- Ejecutar typecheck y lint del frontend.
- Validar manualmente invitacion, edicion, detalles, filtro global y administracion contextual con permisos de lectura y actualizacion.
- Confirmar manejo de Clientes inactivos, estados vacios y errores `409`.
- Actualizar progreso, task list, indice y documentos de cierre.

No se agregan pruebas automatizadas en esta entrega.

La verificacion estatica paso con `typecheck`, `lint` y `git diff --check`. La validacion manual fue confirmada por el usuario y la spec queda cerrada formalmente.
