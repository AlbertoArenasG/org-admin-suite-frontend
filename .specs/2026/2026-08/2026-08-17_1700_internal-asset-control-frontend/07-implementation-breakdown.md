# Implementation Breakdown

## Slice 1. Scope Closure

- Estado: completed
- Objetivo:
  - cerrar el alcance funcional real de esta spec frontend

## Slice 2. Structural Definition

- Estado: completed
- Objetivo:
  - definir pantallas, navegación y estado frontend del módulo

## Slice 3. Internal Asset Maintenance Records Foundation

- Estado: in_progress
- Objetivo:
  - implementar la base frontend del recurso principal `internal-asset-maintenance-record`
- Subfases:
  - 3.1 Wiring de rutas y navegación
    - Estado: completed
    - crear rutas de:
      - `list`
      - `create`
      - `detail`
      - `edit`
    - integrar entrada del módulo en sidebar según estructura ya aprobada
    - asegurar navegación:
      - listado -> detalle
      - detalle -> editar
      - create/edit -> volver al flujo correcto
  - 3.2 Feature state y contratos consumidos
    - Estado: completed
    - crear frontera base en:
      - `src/features/internal-asset-control/*`
    - modelar contratos frontend para:
      - listado paginado
      - detalle
      - create
      - edit
      - delete
      - catálogos auxiliares consumidos
    - implementar thunks/servicios/selectores mínimos del recurso principal
  - 3.3 Listado operativo
    - Estado: completed
    - construir tabla base con columnas aprobadas:
      - activo
      - identificador
      - tipo de mantenimiento
      - status persistido
      - estado derivado por vencimiento
      - fecha de vencimiento
      - provider
      - actualizado
    - integrar:
      - búsqueda
      - filtros aprobados
      - sorting base
      - acciones por fila:
        - ver detalle
        - editar
        - eliminar
  - 3.4 Detalle por bloques
    - Estado: completed
    - construir vista de detalle con bloques de:
      - resumen principal
      - datos del registro
      - policies asociadas
      - provider
    - representar de forma explícita:
      - status persistido
      - estado derivado por vencimiento
    - dejar preparado el espacio visual para follow-up manual de `slice 4`
  - 3.5 Formulario create/edit
    - Estado: in_progress
    - construir formulario por bloques:
      - principal
      - policies
      - provider
    - integrar selectores reutilizables de:
      - `expiration_status_policy`
      - `expiration_notification_policy`
    - mostrar resumen corto de policy seleccionada:
      - nombre
      - estado
      - número de reglas
  - 3.6 UX de `expiration_date`
    - Estado: pending
    - implementar cálculo automático a partir de:
      - `last_maintenance_at`
      - `interval`
    - soportar override manual explícito
    - mostrar señal de override manual
    - agregar acción para volver a la fecha sugerida
  - 3.7 Bloque provider
    - Estado: pending
    - implementar disclosure progresivo
    - validar campos solo cuando:
      - `sentToProvider = true`
    - conservar datos al apagar el bloque
    - reflejar correctamente provider en listado/detalle cuando aplique
  - 3.8 Delete y estados vacíos/errores
    - Estado: pending
    - integrar acción de delete dentro del flujo del módulo
    - contemplar estados de:
      - loading
      - empty
      - error
      - retry
    - dejar consistente el retorno al listado tras acciones mutativas

## Slice 4. Provider Follow-Up

- Estado: pending
- Objetivo:
  - integrar el follow-up manual al provider cuando aplique

## Slice 5. Validation And Handoff

- Estado: pending
- Objetivo:
  - validar flujos principales y dejar la spec lista para cierre
