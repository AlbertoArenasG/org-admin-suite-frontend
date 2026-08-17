# Plan

## Objective

Definir e implementar la base frontend operativa de `internal-asset-control`, centrada en `internal-asset-maintenance-record` como primer módulo consumidor de:

- `recipient_groups`
- `expiration_status_policies`
- `expiration_notification_policies`

## Planned Sequence

1. Cerrar la frontera funcional de `v1` y confirmar que la spec solo consumirá recursos reutilizables ya existentes.
2. Aterrizar la navegación del módulo y la frontera única de feature state en `src/features/internal-asset-control/*`.
3. Diseñar la experiencia operativa del listado, distinguiendo:
   - status persistido
   - estado derivado por vencimiento
   - acciones principales por fila
4. Diseñar la vista de detalle como superficie principal de lectura operacional, incluyendo:
   - resumen principal
   - datos del registro
   - policies asociadas
   - provider
   - follow-up manual
5. Diseñar el formulario `create/edit` por bloques:
   - principal
   - policies
   - provider
6. Resolver la UX de `expiration_date` con:
   - cálculo automático por defecto
   - override manual explícito
   - acción para volver a la fecha sugerida
7. Implementar la base operativa del recurso principal.
8. Integrar follow-up manual al provider.
9. Validar flujos principales y dejar la spec lista para cierre.

## Out Of Scope

- automatización técnica de notificaciones
- scheduler, cron o procesamiento batch
- rediseño de módulos ya cerrados:
  - `recipient_groups`
  - `expiration_status_policies`
  - `expiration_notification_policies`
- catálogo maestro de activos internos
