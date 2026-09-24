# Task List: Customer Service Record Creation Wizard Migration

## Phase 1: Shared Contracts

- [ ] Definir slot opcional de acciones primarias en `DataTableToolbar` y
      crear el campo de fecha para formularios.
  - Depends on: definition approval.
  - Close when: ambos contratos son reutilizables, no cambian filtros ni las
    tablas existentes, y su documentacion viva esta actualizada.

## Phase 2: Creation Boundary

- [ ] Separar contrato de creacion, schema y body HTTP del payload de edicion.
  - Depends on: Phase 1.
  - Close when: el POST de creacion no puede incluir campos legacy y Redux
    conserva sus responsabilidades remotas actuales.

## Phase 3: Wizard And Adoption

- [ ] Implementar el dialogo wizard, los tres pasos, descarte, permisos,
      submit, toast, navegacion y retiro del acceso legacy de creacion.
  - Depends on: Phases 1 and 2.
  - Close when: todos los criterios de aceptacion se validan manualmente y las
    rutas legacy de creacion ya no forman parte del flujo.

## Phase 4: Closure

- [ ] Ejecutar verificacion estatica, validacion manual y cerrar artefactos de
      la spec.
  - Depends on: Phase 3.
  - Close when: no hay tareas pendientes, documentos vivos actualizados y
    estado de spec consistente.
