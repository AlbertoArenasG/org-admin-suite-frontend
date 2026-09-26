# Implementation Breakdown: Customer Service Record Customer And Delivery Migration

## Slice 1: Customer Delivery Contract And Feature State

- Status: implemented and statically verified.
- Goal: incorporar payload, opciones, thunks, mapper y estado del bloque.
- Artifacts: `types.ts`, `customerServiceRecordMappers.ts`,
  `customerServiceRecordsThunks.ts`, `customerServiceRecordsSlice.ts`.
- Steps:
  1. Declarar payload de cliente y entrega, intervalo y opciones propias.
  2. Implementar thunks para las cuatro fuentes de opciones y el PUT.
  3. Añadir reducers de carga, éxito y error sin cambiar estado del listado.
- Limits: no UI, navegación, imports ni estado de otros features.
- Close: el feature puede resolver todas sus opciones y persistir el bloque.

## Slice 2: Navigation And Independent Form

- Status: implemented and statically verified; manual validation pending.
- Goal: incorporar la segunda sección con navegación scroll spy y UX completa.
- Artifacts: página de detalle, navegación de secciones, schema, formulario y
  traducciones.
- Steps:
  1. Montar navegación de anclas semánticas para ambas secciones.
  2. Construir lectura, edición y validación del bloque responsive.
  3. Implementar dependencia cliente-usuarios, cálculo de fecha estimada y
     guardado con feedback, toast y recuperación.
- Limits: no modificar primer bloque, boundary, shell, listado o legacy.
- Close: el bloque cumple todos los criterios de aceptación y queda listo para
  validación manual.

## Slice 3: Manual Validation And Closure

- Status: completed.
- Goal: verificar comportamiento real y cerrar documentación.
- Artifacts: tareas, progreso, matriz manual, definición e índice.
- Close: criterios manuales confirmados, checks estáticos registrados y sin
  pendientes documentales.
