# Decisions

## Decision 01. Ubicacion

- Estado: `approved`
- Ruta: `/dashboard/users/invitations`
- Navegacion: tercer subitem dentro de `Usuarios`
- Razon: conserva el ciclo de alta de usuarios en una sola seccion, sin mezclar invitaciones con usuarios ya registrados ni crear un modulo independiente.

## Decision 02. Visibilidad por permisos

- Estado: `approved`
- `Lista de usuarios`: `USERS/READ`
- `Invitar usuario`: `USER_REGISTRATION_INVITATIONS/CREATE`
- `Administrar invitaciones`: `USER_REGISTRATION_INVITATIONS/READ`
- `Reenviar`: `USER_REGISTRATION_INVITATIONS/RESEND`
- `Revocar`: `USER_REGISTRATION_INVITATIONS/REVOKE`
- La seccion padre se muestra si existe al menos uno de esos accesos.

## Decision 03. Alcance de la vista

- Estado: `approved`
- Ruta operativa: `/dashboard/users/invitations`.
- Incluye listado, filtros, ordenamiento, paginacion y acciones por fila.
- Reutiliza `/dashboard/users/invite` para crear una invitacion.
- Tras crear una invitacion, redirige al listado de invitaciones.
- No incluye detalle individual ni un formulario de alta duplicado.

## Decision 04. Tabla y consultas

- Estado: `approved`
- Columnas: correo, rol con tipo de usuario, estado, ultimo envio, reenvios, creada y acciones.
- Controles: busqueda, filtro por estado, ordenamiento por estado/creacion, paginacion y administracion de columnas.
- No se exponen IDs tecnicos, auditoria ni el formulario completo.

## Decision 05. Acciones y resultado de envio

- Estado: `approved`
- Reenvio y revocacion solo para `PENDING`, con confirmacion explicita.
- Reenvio advierte rotacion de token; revocacion es destructiva y terminal.
- La fila se reemplaza con la respuesta de la mutacion; un fallo de proveedor conserva la invitacion reenviable.
- Iconos de ciclo de vida: `MailClock`, `MailCheck` y `MailX`; el fallo de proveedor usa `MailWarning` en la metadata de envio.
- El fallo de proveedor tiene una senal discreta adicional sin colorear toda la fila.

## Decision 06. Frontera de estado

- Estado: `approved`
- Nueva feature: `features/user-registration-invitations`.
- Centraliza crear, listar, reenviar y revocar.
- La creacion actual se mueve desde `features/users` como refactor acotado, sin modificar UI, contrato ni ruta.
- `features/users` conserva solo usuarios ya registrados.
- Los componentes nuevos viven en `components/user-registration-invitations`.

## Decision 07. Estados y feedback

- Estado: `approved`
- Skeleton inicial, estado vacio con CTA condicionado, sin resultados con limpieza de filtros y error con reintento.
- La metadata heredada ausente se presenta como `Sin intentos registrados`.
- Errores: mensaje backend primero y fallback localizado.
- Exitos: snackbar y reemplazo de fila.

## Decision 08. Rutas y localizacion

- Estado: `approved`
- Ruta: `/dashboard/users/invitations`.
- Breadcrumbs: `Panel > Usuarios > Administrar invitaciones`.
- Alta desde el listado: `/dashboard/users/invite`.
- El formulario redirige tras exito a `/dashboard/users/invitations`.
- Namespace propio en espanol e ingles; no nueva tarjeta de dashboard.
