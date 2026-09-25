# Plan: Customer Service Record General Details Migration

## Objective

Introducir el primer bloque de la nueva vista individual de registros de
servicio a clientes en Next Dashboard: `Detalles generales`, con lectura y
edición local según permisos.

## Target Design

- Ruta individual protegida por el boundary institucional y sin header propio.
- Modelo canónico individual, opciones y mutación dentro de
  `customer-service-records`, separado del estado de listado.
- Formulario independiente de detalles generales inspirado en usuario y
  compuesto con los controles vigentes de Next Dashboard.

## Phases

### Phase 1. Individual Resource Contract

- Declarar modelo de detalle, payload de PUT y rama Redux individual.
- Incorporar mapeador, GET individual, opciones de detalles y PUT dentro del
  feature.

### Phase 2. Detail Page And General Details Form

- Crear ruta con boundary, carga, estados remotos y breadcrumb de folio.
- Implementar formulario local con lectura, edición, validación, cancelación,
  feedback, toast y reemplazo canónico tras guardar.

### Phase 3. Validation And Closure

- Ejecutar verificación estática y solicitar validación manual.
- Actualizar tareas, progreso y matriz de validación para cerrar la spec.

## Sequencing Notes

- La primera fase no toca ni depende de componentes de otros features.
- La página no se implementa antes de que el modelo, thunks y estado individual
  estén disponibles.
- Scroll-spy y cualquier bloque posterior quedan fuera: el formulario actual
  no debe anticiparlos.

## Exit Criteria

- La ruta individual cumple todos los criterios de aceptación de `00`.
- No quedan tareas pendientes, desviaciones sin documentar ni dependencias
  cruzadas agregadas.
