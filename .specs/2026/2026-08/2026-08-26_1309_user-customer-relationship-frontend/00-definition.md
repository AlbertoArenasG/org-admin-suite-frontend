# Definition

## Purpose

Esta spec define la integracion frontend de relaciones usuario-cliente antes de iniciar cambios estructurales.

Reglas de trabajo:

- no iniciar implementacion mientras existan decisiones criticas pendientes
- las decisiones se revisan y aprueban una por una
- frontend consume los contratos y reglas resueltas por backend; no duplica validaciones de negocio
- las decisiones aprobadas deben quedar documentadas antes de generar el diseno tecnico y el breakdown de implementacion

## Overall Status

- Initiative: `user-customer-relationship-frontend`
- Definition status: `completed`
- Technical design status: `completed`
- Implementation ready: `yes`

## Confirmed Backend Contract

La API ya soporta:

- `GET /v1/customers/options` para clientes activos seleccionables
- `customer_ids` opcional en creacion de invitaciones `USER`
- detalle administrativo de invitacion con clientes seleccionados
- `customer_ids` opcional en edicion de usuarios `USER`
- detalle administrativo de usuario con clientes relacionados
- `GET /v1/users?customer_id=:customerId` para filtrar usuarios `USER` relacionados
- `GET /v1/users?customer_relationship=UNASSIGNED` para usuarios de negocio sin relaciones
- administracion contextual desde Clientes: listado relacionado, lookup de candidatos, asociacion y desasociacion
- nombres de empresa de contactos derivados exclusivamente en backend

Consultar el contrato completo en `org-admin-suite-api/docs/frontend/user-customer-relationship-handoff.md`.

---

## Decision 01. Alcance de superficies administrativas

### Context

La relacion usuario-cliente participa en tres momentos distintos:

- seleccionar clientes al invitar un usuario
- consultar los clientes asociados a una invitacion antes de consumirla
- administrar y consultar relaciones efectivas de usuarios registrados

El backend tambien permite filtrar usuarios por su relacion con un cliente, pero no obliga a que esa capacidad se integre en la misma entrega visual.

### Options

1. Integrar invitacion, detalle de invitacion, edicion y detalle de usuario; dejar filtros por cliente para una spec futura.
2. Integrar tambien filtro por cliente en Usuarios y un listado contextual de usuarios dentro de Clientes.
3. Limitar esta entrega a la creacion de invitaciones.

### Recommendation

Opcion 2.

Entrega el ciclo administrativo completo de asignar, revisar, corregir y consultar relaciones desde ambos dominios, sin requerir nuevas reglas de backend.

### Implications

- se reutiliza el catalogo `GET /v1/customers/options` en formularios de invitacion y edicion
- se agrega una vista o patron para detalle de invitacion
- se extienden detalle y edicion de usuario sin mezclar logica de contactos
- la lista de Usuarios incorpora el filtro por cliente relacionado
- Clientes incorpora una administracion contextual de usuarios relacionados

### Decision Final

Se aprueba la opcion 2.

La spec incluye:

- seleccion de clientes en invitaciones y edicion de usuarios `USER`
- detalle de invitacion y detalle de usuario con clientes relacionados
- filtro de usuarios por cliente en `/dashboard/users`
- listado y administracion contextual de usuarios relacionados dentro del modulo de Clientes

La siguiente decision definira la ubicacion, presentacion y acciones del listado contextual en Clientes.

### Status

approved

---

## Decision 02. Ubicacion del listado contextual en Clientes

### Context

El modulo de Clientes ya cuenta con una ruta de detalle en `/dashboard/customers/[customerId]`. Backend expone una frontera contextual propia para consultar y administrar usuarios `USER` relacionados, sin requerir permisos generales de Usuarios.

### Options

1. Crear una ruta o submodulo independiente de usuarios por cliente.
2. Agregar una seccion `Usuarios relacionados` al detalle de Cliente.
3. Mostrar los usuarios relacionados en la tarjeta del listado general de Clientes.

### Recommendation

Opcion 2.

El dato pertenece al contexto de un cliente concreto y el detalle ya concentra su informacion administrativa. Evita otra ruta, navegacion duplicada y datos relacionales costosos en el listado general.

### Decision Final

Se aprueba agregar una seccion `Usuarios relacionados` en `/dashboard/customers/[customerId]`.

- consulta `GET /v1/customers/:customerId/users`
- mantiene paginacion propia
- con `CUSTOMERS/UPDATE`, muestra la accion `Agregar usuario`; consulta `GET /v1/customers/:customerId/available-users` para candidatos, asocia mediante `POST /v1/customers/:customerId/users` y desasocia mediante `DELETE /v1/customers/:customerId/users/:userId`
- el modal se titula `Agregar usuario al cliente`; el copy no expone relaciones o asociaciones tecnicas
- la accion inversa se llama `Remover usuario` y requiere confirmacion; el mensaje aclara que conserva la cuenta y sus demas relaciones con Clientes
- estas acciones no requieren `USERS/READ` ni `USERS/UPDATE`; se muestran solo conforme a los permisos directos de Clientes del actor
- para Clientes `INACTIVE`, la seccion permanece consultable, pero no permite asociar ni desasociar
- el detalle del patron visual se definira durante el diseno tecnico

### Status

approved

---

## Decision 03. Seleccion multiple de clientes

### Context

Invitaciones y usuarios `USER` pueden relacionarse con cero, uno o varios clientes activos. El mismo campo debe aplicar en creacion y edicion, mientras que `ADMIN` no acepta `customer_ids`.

### Options

1. Selector multiple reutilizable con busqueda y chips de seleccion.
2. Lista de checkboxes de todos los clientes.
3. Select HTML multiple nativo.

### Recommendation

Opcion 1.

Permite escalar con el numero de clientes, conserva claridad visual y evita duplicar logica entre los dos formularios.

### Decision Final

Se aprueba un selector multiple reutilizable de clientes:

- aparece solo cuando el rol seleccionado corresponde a `USER`
- es opcional; una seleccion vacia es valida
- permite buscar y remover clientes seleccionados mediante chips
- consulta `GET /v1/customers/options` solo al requerir el campo
- para `ADMIN`, limpia la seleccion, oculta el control y omite `customer_ids` del request
- se reutiliza en invitacion y edicion sin reglas distintas de frontend
- ocupa el ancho completo despues de seleccionar el rol, con etiqueta `Clientes relacionados` y ayuda `Opcional. Agrega los clientes relacionados con este usuario.`
- usa un combobox con placeholder `Buscar y agregar clientes...`; las selecciones se muestran como chips removibles y se excluyen localmente de los candidatos
- las relaciones historicas con Clientes inactivos se muestran como chips de solo lectura con etiqueta `Inactivo`

### Status

approved

---

## Decision 04. Detalles de invitaciones y usuarios

### Context

Los listados de invitaciones y usuarios mantienen contratos ligeros. Backend expone los resumentes de clientes solo en sus detalles administrativos, por lo que esa informacion no debe cargarse ni renderizarse por fila.

### Options

1. Exponer clientes solo en los formularios de invitacion y edicion.
2. Agregar los clientes a las tablas generales.
3. Exponer clientes en los detalles administrativos correspondientes.

### Recommendation

Opcion 3.

Mantiene los listados escaneables, consume los contratos previstos por backend y permite presentar relaciones de forma completa y contextual.

### Decision Final

Se aprueba:

- crear `/dashboard/users/invitations/[invitationId]`, accesible desde la tabla de invitaciones
- mostrar sus clientes relacionados junto con la informacion administrativa de la invitacion
- agregar una seccion `Clientes relacionados` a `/dashboard/users/[userId]`
- presentar nombre y estatus localizado de cada cliente
- no incluir estos resumentes en tablas generales
- reutilizar una seccion secundaria compacta en ambos detalles, con filas de nombre y badge de estatus
- no crear enlaces ni acciones hacia Clientes desde esta seccion, para no asumir `CUSTOMERS/READ`
- mostrar `Sin clientes relacionados` cuando el resumen este vacio

### Status

approved

---

## Decision 05. Filtro de usuarios por cliente

### Context

Backend permite filtrar por `customer_id` o por `customer_relationship=UNASSIGNED`, como parametros mutuamente excluyentes. La vista general de Usuarios necesita una forma simple de consultar los usuarios relacionados a un cliente; la busqueda de usuarios no relacionados corresponde a un flujo futuro de asociacion desde Clientes.

### Options

1. Exponer selectores separados para cliente y estado de relacion.
2. Exponer solo selector de cliente y fijar la relacion en `true`.
3. No agregar filtros hasta construir la futura asociacion desde Clientes.

### Recommendation

Opcion 2.

Resuelve la consulta administrativa actual sin introducir una opcion cuyo significado operativo aun no tiene una superficie definida.

### Decision Final

Se aprueba:

- `/dashboard/users` muestra solo el selector `Cliente` con placeholder `Filtrar por cliente`
- al seleccionar un cliente, envia solo `customer_id`
- al seleccionar o limpiar, reinicia a pagina 1 y conserva busqueda, orden y demas filtros
- no se expone `customer_relationship=UNASSIGNED` en esta vista
- el caso `UNASSIGNED` queda reservado para una futura superficie de asociacion desde el directorio de Clientes
- si no hay coincidencias, muestra `No hay usuarios relacionados con este cliente.`

### Status

approved
