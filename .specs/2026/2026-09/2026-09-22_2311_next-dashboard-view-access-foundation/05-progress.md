# Progress: Next Dashboard View Access Foundation

## 2026-09-22 - Apertura Y Análisis

- Se cerró la migración administrativa de Registros de servicio antes de abrir
  esta fundación transversal.
- Se confirmó que dashboard legacy mezcla guardias en páginas, contenedores y
  errores de tablas; no se migrará como parte de esta iniciativa.
- Se identificaron tres vistas Next Dashboard: Seguimiento, Registros de
  servicio y Detalle editable de Usuario. Las dos primeras resuelven `READ` en
  fronteras distintas; Usuario aún no tiene guardia de entrada explícita.

## 2026-09-22 - Decisiones Aprobadas

- `AuthGuard` conserva autenticación e hidratación global; un boundary nuevo
  resuelve acceso de vista dentro de Next Dashboard.
- La denegación no monta contenido, no muestra fallback ni notificación y usa
  `router.replace('/dashboard')`.
- El boundary provee capacidades internas del mismo módulo mediante un hook
  acotado a descendientes.
- La primera versión acepta un módulo y una operación de entrada por vista.

## Current Status

Definición técnica completada. Implementación y validación permanecen
pendientes.
