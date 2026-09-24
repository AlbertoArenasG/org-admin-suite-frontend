# Task List: Customer Service Record Creation Wizard Migration

## Phase 1: Legacy Creation Retirement

- [ ] Eliminar por completo el flujo legacy de creacion antes de construir su
      reemplazo Next Dashboard.
  - Depends on: definition approval.
  - Includes: ruta `/new`, entrada lateral, ramas `mode="create"`, thunk y
    estado exclusivo de create, dependencia de `useSnackbar` para alta y
    referencias al payload amplio desde el POST.
  - Preserves: detalle, edicion, sus rutas y los tipos o mapeos amplios que
    todavia necesita PATCH.
  - Close when: los formularios legacy solo admiten edicion y un barrido no
    encuentra una entrada ejecutable de creacion legacy.

## Phase 2: Shared Contracts

- [ ] Definir slot opcional de acciones primarias en `DataTableToolbar` y
      crear el campo de fecha para formularios.
  - Depends on: Phase 1.
  - Close when: ambos contratos son reutilizables, no cambian filtros ni las
    tablas existentes, y su documentacion viva esta actualizada.

## Phase 3: Creation Boundary

- [ ] Separar contrato de creacion, schema y body HTTP del payload de edicion.
  - Depends on: Phase 2.
  - Close when: el POST de creacion no puede incluir campos legacy y Redux
    conserva sus responsabilidades remotas actuales.

## Phase 4: Wizard And Adoption

- [ ] Implementar el dialogo wizard, los tres pasos, descarte, permisos,
      submit, toast y navegacion sobre el reemplazo Next Dashboard.
  - Depends on: Phase 3.
  - Close when: el flujo nuevo queda implementado y todos sus criterios estan
    listos para validacion manual. No se reintroducen ruta, navegacion, ramas,
    payload ni feedback legacy de creacion; los componentes compartidos ya
    quedaron solo para edicion en Phase 1.

## Phase 5: Closure

- [ ] Ejecutar verificacion estatica, validacion manual y cerrar artefactos de
      la spec.
  - Depends on: Phase 4.
  - Close when: no hay tareas pendientes, documentos vivos actualizados y
    estado de spec consistente.
