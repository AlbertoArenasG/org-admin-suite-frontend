# Analysis: Customer Service Record General Details Migration

## Initiative

- Name: `customer-service-record-general-details-migration`
- Date: `2026-09-25`

## Current State

- La ruta y los componentes legacy de detalle/edición fueron eliminados antes
  de abrir esta iniciativa. Las acciones temporales de la tabla pueden apuntar
  a una ruta inexistente hasta terminar la migración completa.
- `src/features/customer-service-records/` ya es el límite del módulo: tiene
  `types.ts`, `customerServiceRecordsThunks.ts` y
  `customerServiceRecordsSlice.ts`. Hoy contiene estado y thunks del listado,
  opciones de listado, creación y eliminación, no del recurso individual.
- La ruta de usuario en `src/app/dashboard/users/[userId]/page.tsx` establece
  la composición Next Dashboard de referencia: boundary, shell, carga, error,
  not-found, `ResourceFormRoute` y permiso `UPDATE` local.
- Los contratos compartidos disponibles incluyen `ResourceFormFrame`,
  `ResourceFormSection`, `ResourceFormActions`, `MutationFeedback`,
  `MutationRecovery`, `FormCombobox`, `FormDateInput`, `Textarea`,
  `FormField` y `FieldGroup`.
- La configuración de breadcrumbs del shell es estática. Para presentar el
  folio cargado en el `Workspace Header` sin añadir un header ni breadcrumb
  duplicado en la página, requiere un contexto dinámico y acotado al shell.

## Backend Contracts

- `GET /v1/customer-service-records/:recordId` requiere `READ` y devuelve el
  registro completo con `service_number_display`, detalles, cliente, activos,
  entrega, proveedor y documentos.
- `PUT /v1/customer-service-records/:recordId/details` requiere `UPDATE`.
  Recibe `service_type_code`, `requested_at`, `observations` y
  `operational_status`; también devuelve el registro completo.
- `GET /v1/customer-service-record-service-types/options` entrega las
  opciones remotas del campo tipo de servicio.
- Estado operativo es un enum backend: `PENDING`, `IN_PROGRESS`,
  `COMPLETED`, `CANCELLED`. No hay endpoint de opciones.

## Findings

- Mapear desde este momento la respuesta completa del GET a un modelo canónico
  del feature permite adoptar los siguientes bloques sin repetir la consulta,
  el adaptador ni el ownership del recurso.
- Solo se renderizan y editan los cuatro campos de detalles generales; que el
  modelo conserve otros datos no expande el alcance visual ni funcional.
- Las opciones del bloque se resuelven desde un thunk propio de este feature,
  aunque su endpoint ya sea consumido en otra experiencia. Reutilizar un thunk
  externo acoplaría fronteras de módulo.
- La vista de usuario es inspiración de composición y estados, no una fuente
  de imports, estado ni dependencias de clientes/roles.

## Risks

- Mezclar estado individual con `list` puede producir datos obsoletos o
  sobrescrituras entre pantallas. Se crea una rama de estado independiente.
- Reutilizar opciones del listado o de otros features rompería el límite del
  módulo. El bloque define su propia carga de opciones.
- Implementar un formulario global anticiparía bloques no definidos. El primer
  formulario se mantiene aislado.
- Un feedback con duración distinta de 800 ms incumpliría la decisión de UX.

## Constraints

- No se reintroduce compatibilidad legacy ni se modifica el listado.
- La implementación debe respetar `DashboardViewAccessBoundary` y
  `useDashboardViewAccess`.
- La validación visual corresponde a la persona usuaria; el agente verifica
  tipos, lint dirigido, build y consistencia documental.
