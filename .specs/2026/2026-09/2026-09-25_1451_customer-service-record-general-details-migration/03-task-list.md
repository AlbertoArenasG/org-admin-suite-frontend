# Task List: Customer Service Record General Details Migration

## Phase 1: Individual Resource Contract

- [x] Crear el contrato, mapper, thunks y estado Redux del recurso individual
      dentro de `customer-service-records`.
  - Depends on: definition approval.
  - Close when: GET, opciones y PUT de detalles tienen ownership exclusivo del
    feature y sus respuestas actualizan la rama individual canónica.

## Phase 2: Detail Page And General Details Form

- [x] Implementar la ruta Next Dashboard y el bloque independiente de detalles
      generales.
  - Depends on: Phase 1.
  - Validation status: completed.
  - Close when: boundary, estados de pantalla, breadcrumb, permiso `UPDATE`,
    formulario, mutación y feedback cumplen los criterios de aceptación.

## Phase 3: Validation And Closure

- [x] Ejecutar verificación estática, registrar validación manual y cerrar los
      artefactos de la spec.
  - Depends on: Phase 2.
  - Close when: no hay tareas pendientes, la matriz manual está marcada por la
    persona usuaria y no quedan documentos contradictorios.
