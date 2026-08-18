# Task List

## Phase 1. Foundation

- [x] Cerrar el alcance funcional de la spec
      Status: completed

- [x] Definir pantallas, navegación y estructura del módulo
      Status: completed

- [x] Definir dónde vivirá el estado frontend del módulo
      Status: completed

- [x] Definir la naturaleza operativa del listado principal
      Status: completed

- [x] Definir la estructura funcional de la vista de detalle
      Status: completed

- [x] Definir la estructura del formulario `create/edit`
      Status: completed

- [x] Definir la convivencia entre status persistido y estado derivado por vencimiento
      Status: completed

- [x] Definir la UX de selección de policies reutilizables
      Status: completed

- [x] Definir el comportamiento del bloque provider
      Status: completed

- [x] Definir la UX de `expiration_date` con cálculo automático y override manual
      Status: completed

## Phase 2. Implementation

- [x] Implementar base frontend de `internal-asset-maintenance-record`
      Status: completed

- [x] Integrar follow-up manual al provider
      Status: completed

## Phase 3. Validation

- [x] Validar flujos principales y actualizar documentación de progreso
      Status: completed
      Checklist sugerida: - listado: - carga inicial - búsqueda - filtros - sorting - navegación a detalle - create: - cálculo automático de `expiration_date` - override manual - restore de fecha sugerida - bloque provider apagado/encendido - submit exitoso - edit: - carga de detalle - conservación de datos del bloque provider - actualización exitosa - detail: - render por bloques - delete - follow-up manual al provider - estados de error: - retry en listado - retry en detail - retry en create/edit
