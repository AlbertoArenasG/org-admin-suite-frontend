# Definicion: Migracion Del Listado De Recepcion, Recoleccion Y Entrega

## Estado

- Initiative: `service-package-records-list-next-dashboard-migration`
- Date: `2026-09-29`
- Definition status: `completed`
- Implementation ready: `yes`
- Implementation status: `completed`
- Validation status: `completed`
- Spec status: `completed`

## Problema

El listado legacy de Recepcion, Recoleccion y Entrega fue eliminado antes de
esta iniciativa, incluyendo ruta, tabla MUI/TanStack v8, estado local,
fetching, filtros, acciones y baja. La ruta individual Next Dashboard ya esta
implementada y requiere una superficie de entrada administrativa nueva.

## Resultado Esperado

Una persona con `SERVICE_PACKAGES/READ` podra consultar la coleccion desde
`/dashboard/service-packages-records` mediante el `DataTable` canonico de Next
Dashboard, buscar, filtrar por tipo de servicio, paginar, abrir el detalle y,
si tiene `SERVICE_PACKAGES/DELETE`, eliminar un registro con confirmacion y
feedback.

## Alcance Aprobado

- Crear desde cero la ruta de listado, shell, entrada de sidebar y tabla con
  `DataTable` compartido.
- Mantener las seis columnas visibles del listado anterior: orden de servicio,
  tipo de servicio, empresa, recolector, fecha de visita y fecha de creacion.
- Adoptar busqueda remota, filtro remoto de tipo de servicio, paginacion
  controlada por URL y preferencias globales persistidas de filas por pagina y
  densidad.
- Restaurar la navegacion a detalle mediante el enlace explicito de orden de
  servicio y la accion primaria `Ver detalle`; el menu de acciones, clic
  derecho y doble clic se resuelven por el contrato de `DataTable`.
- Incorporar la accion destructiva `Eliminar` solo para quien tenga permiso,
  con `DestructiveConfirmationDialog`, thunk, feedback y recarga de pagina.
- Actualizar documentacion viva despues de la validacion manual aprobada.

## Fuera De Alcance

- Carga ZIP, PWA Recoleccion, creacion, edicion o cambios al detalle.
- Cambios de backend, endpoints, DTOs, dominio, persistencia o permisos de API.
- Columnas ordenables, parametros de sort, filtro por `package_id`, filtros
  adicionales, seleccion masiva, expansion, edicion inline, virtualizacion e
  infinite scroll.
- Compatibilidad temporal con la ruta, UI, store, componentes o interacciones
  legacy eliminados.
- Pruebas unitarias, por acuerdo expreso del proyecto.

## Restricciones

- La fuente de verdad es el codigo y contrato vigentes; el historial legacy
  solo aporta el inventario de datos a conservar.
- `DataTable` no ejecuta HTTP, no conoce permisos, rutas ni reglas de dominio.
- Redux conserva coleccion remota, opciones y mutacion; Zustand conserva solo
  estado local de tabla y URL. `useDataTablePreferencesStore` conserva las
  preferencias globales persistidas de limite y densidad. Ninguna capa mezcla
  detalle con listado.
- Se usan primitives, tokens, responsive, accesibilidad, menus y dialogos
  reutilizables existentes; no se introducen estilos, componentes o contratos
  paralelos.

## Decisiones Cerradas

- El API ya cubre el alcance: `GET /v1/service-packages/records`,
  `GET /v1/service-packages/records/options` y
  `DELETE /v1/service-packages/records/:recordId`.
- La base ordena por `createdAt` descendente. La tabla no expone ordenamiento
  porque el endpoint no recibe sort y el contrato de `DataTable` lo admite como
  capacidad opcional.
- El filtro de tipo de servicio usa `TableFilterDialog` con borrador y
  confirmacion explicita; la busqueda permanece en toolbar con debounce.
- El limite usa `useDataTablePreferencesStore` por `userId`; `limit` en URL
  prevalece sobre la preferencia global.
- La tabla es de una sola linea, por lo que adopta por primera vez el selector
  global de densidad de `DataTable`; `compact` y `comfortable` persisten en
  Local Storage mediante el store compartido.
- La accion `Ver detalle` es primaria y `Eliminar` solo aparece con capacidad
  `DELETE`. La pagina se protege con `READ`.

## Gate De Implementacion

La implementacion y la validacion manual aprobada completaron el alcance. No
quedan decisiones criticas, tareas, checks ni artefactos legacy abiertos.
