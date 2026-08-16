# Progress

## 2026-08-16

- Se creó la spec `contacts-recipient-groups-frontend`.
- Se aprobó que esta iniciativa frontend cubra funcionalmente:
  - `contacts`
  - `recipient_groups`
- Se aprobó que el alcance incluya:
  - listado
  - detalle
  - creación
  - edición
  - delete
- Se dejó fuera de esta spec:
  - integración consumidora dentro de otros módulos
  - `internal-asset-control`
- Se aprobó que `contacts` y `recipient_groups`:
  - vivan como módulos separados
  - tengan rutas propias de listado, detalle, creación y edición
  - compartan grupo en el sidebar
- Se aprobó que el estado frontend viva separado por módulo:
  - `src/features/contacts/*`
  - `src/features/recipient-groups/*`
- Se aprobó que `recipient_groups` permita:
  - buscar contactos existentes
  - seleccionar múltiples contactos
  - crear contactos en contexto
- Se aprobó que:
  - el lookup viva dentro del formulario de `recipient_groups`
  - la selección de contactos sea múltiple
  - el alta en contexto se resuelva con `modal` o `drawer`
- Se aprobó el orden de implementación:
  - primero `contacts`
  - después `recipient_groups`
