# Task List

## Phase 1. Feature Foundation

- [ ] Crear `features/user-registration-invitations/types.ts`.
- [ ] Mover el contrato y thunk de creacion de invitacion desde `features/users`.
- [ ] Crear thunks para listado, reenvio y revocacion.
- [ ] Crear slice con estado de listado y mutaciones aisladas.
- [ ] Registrar el reducer en `src/store/store.ts`.
- [ ] Actualizar imports del flujo existente de invitar usuario.

## Phase 2. Navigation And Localisation

- [ ] Crear ruta `/dashboard/users/invitations`.
- [ ] Agregar el subitem de sidebar condicionado por `USER_REGISTRATION_INVITATIONS/READ`.
- [ ] Mantener visibilidad independiente de lista, crear, reenviar y revocar.
- [ ] Redirigir el flujo exitoso de creacion a `/dashboard/users/invitations`.
- [ ] Crear namespaces `userRegistrationInvitations` en espanol e ingles.
- [ ] Registrar namespaces en `src/lib/i18n.ts`.
- [ ] Agregar etiquetas necesarias a `nav.json` y `breadcrumbs.json`.

## Phase 3. Invitation List

- [ ] Crear modelo de fila, mapeo visual y store Zustand de la tabla.
- [ ] Crear serializacion y parsing de query params.
- [ ] Construir toolbar con busqueda, filtro de estado y administracion de columnas.
- [ ] Construir tabla, skeleton, estado vacio, sin resultados y error con reintento.
- [ ] Agregar columnas aprobadas y sus iconos de ciclo de vida.
- [ ] Integrar paginacion y sorting remoto.

## Phase 4. Row Actions

- [ ] Crear menu de acciones condicionado por estado y permisos.
- [ ] Crear dialog de confirmacion para reenvio.
- [ ] Crear dialog destructivo de confirmacion para revocacion.
- [ ] Deshabilitar solo la accion en curso de la fila afectada.
- [ ] Reemplazar la fila al exito y mostrar snackbar localizado.
- [ ] Refrescar la consulta ante `404`, `409` o incompatibilidad con el filtro activo.

## Phase 5. Verification And Closure

- [ ] Ejecutar lint dirigido.
- [ ] Ejecutar typecheck.
- [ ] Validar manualmente permisos y navegacion.
- [ ] Validar busqueda, filtro, sorting, paginacion y columnas.
- [ ] Validar reenvio aceptado, fallo de proveedor, revocacion y estados terminales.
- [ ] Validar invitaciones heredadas sin metadata de envio.
- [ ] Validar la redireccion posterior a crear invitacion.
- [ ] Actualizar progreso, breakdown, definicion e indice de specs al cierre.
