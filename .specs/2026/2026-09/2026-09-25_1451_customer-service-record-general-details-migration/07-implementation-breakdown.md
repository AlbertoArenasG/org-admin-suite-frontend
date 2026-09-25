# Implementation Breakdown: Customer Service Record General Details Migration

## Slice 1: Individual Resource Contract And State

- Phase: 1.
- Status: implementada y verificada estáticamente.
- Goal: introducir el contrato remoto y el estado individual sin construir UI.
- Artifacts: `types.ts`, `customerServiceRecordMappers.ts`,
  `customerServiceRecordsThunks.ts`, `customerServiceRecordsSlice.ts`.
- Steps:
  1. Declarar el modelo canónico completo de detalle, payload de PUT y ramas
     de estado individual.
  2. Implementar mapper API del GET/PUT sin modificar el mapper ni el estado
     del listado.
  3. Agregar thunks de GET individual, opciones de tipos de servicio y PUT de
     detalles dentro de este feature.
  4. Incorporar reducers de pendiente, éxito y error para las tres operaciones.
- Limits: no rutas, componentes, traducciones, listado, creación, cliente,
  proveedor, activos ni documentos.
- Compatibility: estado y thunks actuales mantienen su contrato; no se importa
  ni despacha código de otro feature.
- Validation: typecheck, lint dirigido, inspección de URL/body/mapeo y
  `git diff --check`.
- Close: el feature puede cargar, almacenar y actualizar un registro individual
  de forma aislada.

## Slice 2: Next Dashboard Detail Page And General Details Form

- Phase: 2.
- Status: implementada y validada manualmente.
- Goal: presentar y editar el primer bloque sobre el contrato individual.
- Artifacts: ruta `[recordId]`, `CustomerServiceRecordDetailPage`,
  `CustomerServiceRecordGeneralDetailsForm`, schema, traducciones,
  `FormDateInput` y breadcrumb dinámico del shell.
- Steps:
  1. Montar `DashboardViewAccessBoundary` con `READ`, página y composición de
     carga, error, reintento, not-found y breadcrumb de folio.
  2. Cargar recurso y opciones del bloque desde thunks de
     `customer-service-records`; derivar `canUpdate` mediante el boundary.
  3. Implementar el formulario en modos lectura/edición con campos
     responsive, validación y cancelación local.
  4. Ejecutar PUT, actualizar el recurso canónico, aplicar feedback de 800 ms,
     toast y recuperación de error.
- Limits: no header de página, scroll-spy, formularios globales ni bloques
  posteriores; no se cambia `ResourceForm` ni el boundary compartido.
- Compatibility: sin `UPDATE` se conserva lectura; sin `READ` actúa el
  fallback institucional; no se restaura detalle/edición legacy.
- Validation: typecheck, lint dirigido, build, `git diff --check` y matriz
  manual preparada.
- Close: todos los criterios funcionales del bloque están disponibles para
  validación manual.

## Slice 3: Manual Validation And Closure

- Phase: 3.
- Status: completada.
- Goal: verificar comportamiento y cerrar documentos de la iniciativa.
- Artifacts: `03-task-list.md`, `05-progress.md`, `08-manual-validation.md`,
  `00-definition.md` y, si hubo desviación aprobada, los documentos afectados.
- Steps:
  1. Ejecutar verificación estática y registrar resultados reales.
  2. Solicitar validación manual al usuario y registrar evidencia por criterio.
  3. Marcar tareas y slices solo después de que no existan pendientes.
- Limits: no se agregan funcionalidades ni se absorbe deuda del listado.
- Validation: matriz completa de `08`.
- Close: spec consistente, sin tareas pendientes y con validación manual
  confirmada.
