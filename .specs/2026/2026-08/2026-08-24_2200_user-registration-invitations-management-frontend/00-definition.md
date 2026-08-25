# Definition

## Purpose

Esta spec define la administracion frontend de invitaciones de registro para usuarios de negocio antes de iniciar cambios estructurales.

Regla de trabajo:

- no iniciar implementacion mientras existan decisiones criticas pendientes
- las decisiones se revisan y aprueban una por una
- frontend consume los contratos existentes de backend; no duplica reglas de negocio
- las decisiones aprobadas deben quedar documentadas antes de generar el diseno tecnico y el breakdown de implementacion

## Overall Status

- Initiative: `user-registration-invitations-management-frontend`
- Definition status: `completed`
- Implementation ready: `no`; pending technical design and implementation breakdown

## Confirmed Backend Contract

La API ya entrega para el scope de aplicacion:

- listado paginado de invitaciones mediante `GET /v1/user-registration-invitations`
- filtros por texto y `status`
- ordenamiento por `status` y `created_at`; el default es `created_at DESC`
- reenvio mediante `POST /v1/user-registration-invitations/:invitationId/resend`
- revocacion mediante `POST /v1/user-registration-invitations/:invitationId/revoke`
- operaciones directas independientes: `READ`, `CREATE`, `RESEND` y `REVOKE`
- estados: `PENDING`, `CONSUMED` y `REVOKED`
- metadata de entrega: ultimo intento y estado del ultimo intento
- `resend_count`
- exclusion de invitaciones `MASTER_ADMIN` en esta superficie

El backend concentra las reglas de elegibilidad y concurrencia:

- solo una invitacion `PENDING` puede reenviarse o revocarse
- el reenvio rota el token y deja invalido el enlace anterior
- una invitacion revocada es terminal; para el mismo correo se crea una nueva invitacion
- respuestas `404` y `409` se deben comunicar sin que frontend intente reproducir esas reglas

## Pending Decisions

No quedan decisiones funcionales criticas pendientes.

---

## Decision 01. Ubicacion de la administracion de invitaciones

### Context

El frontend ya concentra los flujos relacionados con usuarios dentro de `/dashboard/users`:

- listado de usuarios en `/dashboard/users`
- creacion de invitaciones en `/dashboard/users/invite`

La nueva superficie no administra usuarios consumados, sino invitaciones previas al registro. Sin embargo, sigue siendo una funcion administrativa del ciclo de alta de usuarios y no justifica un modulo de navegacion independiente.

### Options

1. Crear un modulo de primer nivel para invitaciones
2. Integrar la administracion como una tercera subvista de `Usuarios`
3. Mezclar el listado de invitaciones dentro de la tabla actual de usuarios

### Recommendation

Opcion 2.

Mantiene el ciclo de alta de usuarios en una sola seccion administrativa y separa claramente los usuarios ya registrados de las invitaciones pendientes, consumidas o revocadas.

### Decision Final

Se aprueba crear la ruta:

- `/dashboard/users/invitations`

La seccion `Usuarios` tendra estos subitems, sujetos a sus permisos correspondientes:

- `Lista de usuarios`
- `Invitar usuario`
- `Administrar invitaciones`

La administracion de invitaciones no se mezcla con la tabla de usuarios ni se crea como modulo de primer nivel.

### Status

approved

---

## Decision 08. Rutas, retorno y localizacion

### Decision Final

- La administracion vive en `/dashboard/users/invitations`.
- La navegacion agrega el subitem localizado `Administrar invitaciones`.
- Los breadcrumbs seran: `Panel > Usuarios > Administrar invitaciones`.
- El boton de alta desde el listado enviara a `/dashboard/users/invite`.
- Al completar una invitacion, el formulario redirige a `/dashboard/users/invitations`.
- Se crearan namespaces de localizacion propios en espanol e ingles:
  - `userRegistrationInvitations.json`
- `users.json` conserva los copies del formulario compartido de invitacion.
- No se agregara una tarjeta adicional en el dashboard; la accion existente de invitar usuario permanece sin cambios.

### Status

approved

---

## Decision 07. Estados vacios, errores y feedback localizado

### Decision Final

La vista aplicara estos estados:

| Escenario                  | Comportamiento                                                     |
| -------------------------- | ------------------------------------------------------------------ |
| Carga inicial              | Skeleton de tabla; no pantalla vacia                               |
| Sin invitaciones           | Estado vacio con CTA `Invitar usuario` si existe `CREATE`          |
| Sin resultados de consulta | Mensaje especifico y accion para limpiar filtros                   |
| Error de listado           | Bloque de error con accion `Reintentar`                            |
| Metadata heredada ausente  | Mostrar `Sin intentos registrados`; no tratarlo como error         |
| Error de mutacion          | Priorizar el mensaje de backend y usar copy localizado de respaldo |
| Mutacion exitosa           | Snackbar localizado y actualizacion de la fila                     |

Los mensajes de `404`, `409` y fallo de proveedor no implementaran reglas paralelas de frontend: solo comunicaran el resultado recibido del backend con fallback localizado cuando sea necesario.

### Status

approved

---

## Decision 06. Frontera de estado y refactor de creacion existente

### Context

Actualmente `inviteUser` vive en `features/users`, aunque su recurso real es `user-registration-invitations`. La nueva administracion agregara listado, reenvio y revocacion; mantener esas responsabilidades dentro del slice de usuarios mezclaria entidades con ciclos de vida distintos.

### Decision Final

Se creara la feature frontend:

- `features/user-registration-invitations`

Esta feature sera la unica frontera frontend para:

- crear invitaciones
- listar invitaciones
- reenviar invitaciones
- revocar invitaciones

Tendra sus propios:

- tipos
- slice Redux
- thunks
- estado de listado y mutaciones

El thunk actual de creacion se movera desde `features/users` a esta feature como refactor acotado. No cambia:

- el endpoint
- el contrato de creacion
- `UserForm`
- la ruta `/dashboard/users/invite`
- la experiencia visible de crear una invitacion

`features/users` conservara exclusivamente responsabilidades de usuarios ya registrados:

- listado
- detalle
- edicion
- eliminacion

Los componentes de la nueva pantalla viviran en:

- `components/user-registration-invitations`

### Status

approved

---

## Decision 05. Patron UX para reenvio, revocacion y resultado de envio

### Context

Las acciones solo son validas para invitaciones `PENDING`, pero tienen consecuencias distintas:

- reenviar rota el token e invalida el enlace anterior
- revocar es terminal; el correo necesitara una invitacion nueva

Tambien hace falta distinguir visualmente el resultado tecnico del ultimo intento de correo. Un fallo del proveedor no invalida una invitacion: sigue pendiente y puede reenviarse.

### Decision Final

- `Reenviar` y `Revocar` solo se muestran para invitaciones `PENDING` y con su permiso directo respectivo.
- Ambas acciones solicitan confirmacion:
  - `Reenviar` advierte que el enlace anterior quedara invalidado.
  - `Revocar` usa dialog destructivo y explica que se requerira crear una nueva invitacion para ese correo.
- Mientras una accion esta en curso, frontend bloquea solo la accion de esa fila.
- Al completar una mutacion, frontend sustituye la fila por la respuesta de backend y muestra feedback localizado.
- Ante un fallo de proveedor durante reenvio, la fila conserva el estado `PENDING` y permite reintentar.

La columna `Ultimo envio` mostrara la metadata del proveedor mediante texto y tono. El indicador Lucide de la fila representara el ciclo de vida de la invitacion, no el resultado de ese proveedor:

| Condicion            | Indicador                                                  |
| -------------------- | ---------------------------------------------------------- |
| Invitacion pendiente | `MailClock` para comunicar que el enlace sigue disponible  |
| Invitacion consumida | `MailCheck` para comunicar que el registro fue completado  |
| Invitacion revocada  | `MailX` para comunicar que fue cancelada de forma terminal |

Si el proveedor fallo, la metadata de `Ultimo envio` usara `MailWarning` y una senal visual reforzada en la fila.

La senal de fallo reforzada no usara un fondo completo de fila: se aplicara una marca visual discreta para mantener la tabla legible.

### Status

approved

---

## Decision 04. Informacion, filtros, ordenamiento y acciones de la tabla

### Context

El endpoint de listado entrega datos suficientes para distinguir la condicion de una invitacion, su configuracion de acceso y el resultado del ultimo intento de correo, pero mostrar todos los campos en la tabla agregaria ruido sin aportar capacidad operativa.

El backend admite:

- busqueda
- filtro por `status`
- ordenamiento por `status` y `created_at`
- paginacion

### Decision Final

La tabla mostrara inicialmente:

| Columna            | Uso                                                                       |
| ------------------ | ------------------------------------------------------------------------- |
| Correo electronico | Identifica a la persona invitada                                          |
| Rol                | Muestra `role_name` y `system_role_name` como contexto secundario         |
| Estado             | Chip localizado; muestra fecha contextual cuando fue consumida o revocada |
| Ultimo envio       | Fecha y hora, mas el resultado del ultimo intento                         |
| Reenvios           | Contador de reenvios realizados                                           |
| Creada             | Fecha de creacion de la invitacion                                        |
| Acciones           | Menu contextual condicionado por estado y permiso                         |

La vista incluira:

- busqueda por correo
- filtro de estado: todos, pendiente, consumida y revocada
- ordenamiento por estado y fecha de creacion
- paginacion
- administracion de columnas siguiendo el patron existente

No se mostraran por defecto:

- IDs tecnicos
- IDs de auditoria
- datos completos del formulario de invitacion

### Status

approved

---

## Decision 03. Alcance de la vista y convivencia con la creacion

### Context

El contrato de listado ya entrega la informacion suficiente para operar una invitacion:

- correo
- rol y tipo de usuario
- estado
- datos de creacion, consumo o revocacion
- metadata del ultimo intento de envio
- contador de reenvios

No existe actualmente un endpoint administrativo de detalle de invitacion. Crear una pantalla de detalle frontend sin una necesidad operativa concreta agregaria una superficie sin valor inmediato.

### Decision Final

La primera version tendra una pagina de listado operativo en:

- `/dashboard/users/invitations`

Incluira:

- consulta paginada
- filtros y ordenamiento aprobados para la tabla
- boton `Invitar usuario` cuando exista `CREATE`
- acciones de `Reenviar` y `Revocar` por fila cuando apliquen

No incluira:

- ruta o pantalla de detalle individual
- una nueva implementacion del formulario de invitacion

El boton de alta reutilizara el flujo actual en `/dashboard/users/invite`. Tras crear una invitacion desde ese contexto, frontend regresara al listado de invitaciones.

### Status

approved

---

## Decision 02. Visibilidad de ruta y navegacion por permiso

### Context

El backend expone cuatro operaciones directas e independientes para `USER_REGISTRATION_INVITATIONS`:

- `READ`
- `CREATE`
- `RESEND`
- `REVOKE`

El frontend actual ya separa parcialmente `USERS/READ` de `USER_REGISTRATION_INVITATIONS/CREATE`. La nueva superficie debe conservar esa independencia y no asumir que el acceso a usuarios otorga acceso a invitaciones, ni al contrario.

### Decision Final

La visibilidad y las acciones se gobiernan de forma independiente:

| Superficie                         | Permiso requerido                      |
| ---------------------------------- | -------------------------------------- |
| Subitem `Lista de usuarios`        | `USERS/READ`                           |
| Subitem `Invitar usuario`          | `USER_REGISTRATION_INVITATIONS/CREATE` |
| Subitem `Administrar invitaciones` | `USER_REGISTRATION_INVITATIONS/READ`   |
| Accion `Reenviar`                  | `USER_REGISTRATION_INVITATIONS/RESEND` |
| Accion `Revocar`                   | `USER_REGISTRATION_INVITATIONS/REVOKE` |

La seccion padre `Usuarios` se mostrara cuando el usuario tenga al menos uno de esos accesos.

No se agregan inferencias entre permisos en frontend.

### Status

approved
