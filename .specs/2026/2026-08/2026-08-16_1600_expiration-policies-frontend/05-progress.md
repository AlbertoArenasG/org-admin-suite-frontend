# Progress

## 2026-08-16

- Se creó la spec `expiration-policies-frontend`.
- Se aprobó que esta iniciativa frontend cubra funcionalmente:
  - `expiration_status_policies`
  - `expiration_notification_policies`
- Se aprobó que el alcance incluya:
  - listado
  - detalle
  - creación
  - edición
  - delete
- Se dejó fuera de esta spec:
  - integración consumidora dentro de `internal-asset-control`
- Se aprobó que `expiration_status_policies` y `expiration_notification_policies`:
  - vivan como módulos separados
  - tengan rutas propias de listado, detalle, creación y edición
  - compartan grupo en el sidebar
- Se aprobó que el estado frontend viva separado por módulo:
  - `src/features/expiration-status-policies/*`
  - `src/features/expiration-notification-policies/*`
- Se aprobó el orden de implementación:
  - primero `expiration_status_policies`
  - después `expiration_notification_policies`
- Se aprobó que:
  - cada módulo conserve formularios y pantallas propias
  - la reutilización ocurra solo en componentes y utilidades pequeñas cuando realmente aplique
  - no se fuerce una abstracción grande compartida desde definición
