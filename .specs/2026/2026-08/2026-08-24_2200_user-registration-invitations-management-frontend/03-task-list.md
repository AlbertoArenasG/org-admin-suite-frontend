# Task List

## Phase 1. Feature Foundation

- [x] Crear `features/user-registration-invitations/types.ts`.
- [x] Mover el contrato y thunk de creacion de invitacion desde `features/users`.
- [x] Crear thunks para listado, reenvio y revocacion.
- [x] Crear slice con estado de listado y mutaciones aisladas.
- [x] Registrar el reducer en `src/store/store.ts`.
- [x] Actualizar imports del flujo existente de invitar usuario.

## Phase 2. Navigation And Localisation

- [x] Crear ruta `/dashboard/users/invitations`.
- [x] Agregar el subitem de sidebar condicionado por `USER_REGISTRATION_INVITATIONS/READ`.
- [x] Mantener visibilidad independiente de lista, crear, reenviar y revocar.
- [x] Redirigir el flujo exitoso de creacion a `/dashboard/users/invitations`.
- [x] Crear namespaces `userRegistrationInvitations` en espanol e ingles.
- [x] Registrar namespaces en `src/lib/i18n.ts`.
- [x] Agregar etiquetas necesarias a `nav.json` y `breadcrumbs.json`.

## Phase 3. Invitation List

- [x] Crear modelo de fila, mapeo visual y store Zustand de la tabla.
- [x] Crear serializacion y parsing de query params.
- [x] Construir toolbar con busqueda, filtro de estado y administracion de columnas.
- [x] Construir tabla, skeleton, estado vacio, sin resultados y error con reintento.
- [x] Agregar columnas aprobadas y sus iconos de ciclo de vida.
- [x] Integrar paginacion y sorting remoto.

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
