# Definition: Customer Service Record General Details Migration

## Initiative

- Name: `customer-service-record-general-details-migration`
- Date: `2026-09-25`
- Definition status: `completed`
- Implementation ready: `yes`

## Problem

La funcionalidad legacy de detalle y edición de registros de servicio a
clientes ya fue retirada. El recurso no tiene aún una vista individual en Next
Dashboard. Se requiere reintroducirla de forma incremental, empezando por el
bloque backend `details`, sin recrear ni adaptar patrones legacy.

## Expected Outcome

La ruta `/dashboard/customer-service-records/[recordId]` muestra el registro
individual dentro de Next Dashboard. El primer bloque, `Detalles generales`,
se ve en modo lectura con `READ` y habilita edición local con `UPDATE`. Guarda
mediante `PUT /v1/customer-service-records/:recordId/details`, conserva un
feedback acotado de 800 ms y actualiza el recurso canónico con la respuesta.

## Migration Mandate

Esta iniciativa crea un reemplazo Next Dashboard para el primer bloque de la
vista individual. No restaura rutas, componentes, payloads, estado, permisos,
adaptadores, formularios ni estilos legacy de detalle o edición. Los bloques
de cliente, proveedor, equipos y documentos tampoco se adelantan ni se
imitan: tendrán sus propias specs y formularios independientes.

Todo acceso remoto y estado de esta vista pertenece al feature
`customer-service-records`. Ningún componente de esta migración importa,
despacha o lee thunks o estado de otro feature.

## Included Scope

- Crear la ruta individual de Next Dashboard y protegerla con
  `DashboardViewAccessBoundary` para `CUSTOMER_SERVICE_RECORDS/READ`.
- Extender el shell Next Dashboard con un breadcrumb dinámico de ruta para
  mostrar el folio resuelto sin duplicar breadcrumbs dentro del contenido.
- Cargar el registro individual, mantener su estado canónico y mapear la
  respuesta completa del GET dentro del feature.
- Incorporar al feature los thunks de GET individual, opciones propias de
  detalles y PUT de detalles.
- Construir el bloque `Detalles generales` con formulario independiente,
  modo lectura/edición, validación, cancelación, guardado y recuperación de
  error.
- Mostrar breadcrumb con folio amigable y conservar `recordId` opaco en URL.
- Usar los patrones y controles vigentes de Next Dashboard y `ResourceForm`.
- Actualizar traducciones, documentos de la spec y la guideline de migración
  del shell para documentar el contrato transversal de breadcrumb dinámico.

## Excluded Scope

- Listado administrativo, filtros, acciones de fila, creación o eliminación.
- Bloques de cliente, entrega, proveedor, equipos, archivos o documentos.
- Navegación scroll-spy: se evaluará cuando exista un segundo bloque visible.
- Modificar contratos backend, catálogo de permisos o comportamiento del
  boundary compartido.
- Reusar componentes, thunks, estado o payloads de otros features.
- Reintroducir cualquier funcionalidad legacy de detalle o edición.

## Constraints

- `GET /v1/customer-service-records/:recordId` y el PUT devuelven el registro
  canónico completo; el feature lo reemplaza con cada respuesta exitosa.
- El PUT de detalles siempre incluye `service_type_code`, `requested_at`,
  `observations` y `operational_status`. Observaciones vacías se normalizan a
  `null`.
- Tipo de servicio y fecha son obligatorios. Estado operativo es obligatorio.
  `Observaciones generales` es un textarea opcional.
- Los tipos de servicio se cargan desde su endpoint por un thunk de este
  feature. El estado operativo es catálogo local tipado porque backend no
  expone un endpoint de opciones para él.
- La página no usa header propio; el breadcrumb aporta contexto y muestra el
  folio. La composición toma como referencia la vista individual de usuarios.
- Sin `READ`, el boundary aplica el fallback institucional. Con `READ` sin
  `UPDATE`, el bloque es solo lectura. Con `UPDATE`, solo ese bloque puede
  entrar a edición.
- Cada bloque mantiene su propio formulario, draft, validación, error y modo;
  no se crea un formulario global ni se anidan formularios.
- Guardar muestra `MutationFeedback` y acciones sustituidas durante el envío y
  éxito; tras 800 ms vuelve a lectura y muestra toast. Error conserva draft y
  presenta `MutationRecovery`.
- Los campos usan los controles existentes de Next Dashboard y orientación
  horizontal responsive: etiqueta a la izquierda en escritorio y apilada en
  móvil.

## Acceptance Criteria

- Un actor con `CUSTOMER_SERVICE_RECORDS/READ` puede abrir la ruta individual
  y ve skeleton durante carga, recuperación ante error y estado no encontrado
  cuando corresponde.
- La ruta mantiene el identificador opaco y el breadcrumb muestra
  `Registro {serviceNumberDisplay}`.
- El bloque reproduce tipo de servicio, fecha de solicitud, estado operativo
  y `Observaciones generales` sin controles editables en modo lectura.
- Sin `UPDATE` no hay control de edición. Con `UPDATE`, editar, cancelar y
  guardar afectan solo `Detalles generales`.
- Cancelar descarta el draft local y restaura el último registro canónico.
- Guardar valida, envía exactamente el body contractual, evita doble envío y
  sustituye el recurso con la respuesta del PUT sin un GET adicional.
- Error remoto mantiene valores editables y habilita recuperación; éxito
  muestra feedback durante 800 ms, toast y vuelve a lectura.
- Tipos de servicio, catálogos locales, thunks, slice y adaptadores se
  resuelven solo desde `customer-service-records`.
- Escritorio, móvil, teclado, foco visible, permisos y estados remotos se
  validan manualmente. No se crean pruebas unitarias.

## Open Decisions

Ninguna.
