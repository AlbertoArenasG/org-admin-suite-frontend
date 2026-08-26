# Decisions

## Decision 01. Alcance de superficies administrativas

- Estado: `approved`
- Incluye seleccion de clientes en invitaciones y edicion de usuarios `USER`.
- Incluye detalle de invitacion y detalle de usuario con resumentes de clientes.
- Incluye filtro por cliente relacionado en la lista de Usuarios.
- Incluye listado y administracion contextual de usuarios relacionados dentro del modulo de Clientes.
- No duplica reglas de validacion, seleccion ni sincronizacion que ya resuelve backend.

## Decision 02. Listado en Clientes

- Estado: `approved`
- Vive como seccion `Usuarios relacionados` en `/dashboard/customers/[customerId]`.
- Consume `GET /v1/customers/:customerId/users` con `CUSTOMERS/READ`.
- Con `CUSTOMERS/UPDATE`, consume el lookup de candidatos y las rutas contextuales de asociacion y desasociacion.
- La accion se llama `Agregar usuario` y su modal `Agregar usuario al cliente`; no expone terminologia tecnica de asociaciones.
- La accion inversa se llama `Remover usuario`; requiere confirmacion e informa que no elimina la cuenta ni otras relaciones del usuario.
- Para Clientes `INACTIVE`, conserva lectura y oculta mutaciones.

## Decision 03. Selector de clientes

- Estado: `approved`
- Selector multiple reutilizable, con busqueda y chips.
- Solo visible para el rol seleccionado de tipo `USER`.
- Es opcional y carga las opciones activas bajo demanda.
- Para `ADMIN`, limpia el valor y omite `customer_ids` del request.
- Ocupa el ancho completo despues del rol; usa la etiqueta `Clientes relacionados`, combobox de busqueda y chips removibles.
- Los Clientes ya seleccionados se excluyen localmente de los candidatos; relaciones historicas inactivas se muestran como chips de solo lectura con etiqueta `Inactivo`.

## Decision 04. Detalles de relaciones

- Estado: `approved`
- Nueva ruta: `/dashboard/users/invitations/[invitationId]`.
- El detalle de invitacion muestra sus clientes relacionados.
- El detalle de usuario agrega `Clientes relacionados`.
- Ambos reutilizan una seccion secundaria compacta con nombre y estatus localizado; no incluye enlaces ni acciones hacia Clientes.
- El estado vacio se presenta como `Sin clientes relacionados`; las tablas generales permanecen ligeras.

## Decision 05. Filtro general de Usuarios

- Estado: `approved`
- `/dashboard/users` expone solo el selector `Cliente`, con placeholder `Filtrar por cliente`.
- La seleccion envia solo `customer_id`.
- Al seleccionar o limpiar, reinicia pagina y conserva los demas filtros, busqueda y orden.
- Sin coincidencias, muestra `No hay usuarios relacionados con este cliente.`
- La busqueda `customer_relationship=UNASSIGNED` queda fuera de esta superficie y se reserva para un flujo futuro desde Clientes.
