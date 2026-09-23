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

## 2026-09-23 - Implementación

- Se creó `DashboardViewAccessBoundary` con contexto y
  `useDashboardViewAccess`, exportados desde `dashboard-shell`.
- Las rutas de Seguimiento, Registros de servicio y Detalle editable de Usuario
  adoptaron el boundary con sus permisos de entrada `READ`.
- Seguimiento eliminó su guardia y fallback locales; Registros eliminó su
  comprobación manual y fallback; Usuario consume `UPDATE` y
  `UPDATE_PASSWORD` desde el contexto de la vista.
- No se modificaron Redux, Zustand, thunks, endpoints ni `AuthGuard`.
- `npm run typecheck` y `npm run lint` finalizaron sin errores. El lint conserva
  cuatro advertencias preexistentes ajenas a esta iniciativa.
- El experimento aislado `searchable-dropdown` fue retirado del catálogo y de
  sus assets vendor sin consumidores de negocio.
- `npm run build` completó después de retirar esa ruta; conserva dos
  advertencias preexistentes ajenas a esta iniciativa.

## 2026-09-23 - Validación

- Se validaron las rutas autorizadas y denegadas de Seguimiento, Registros de
  servicio y Detalle editable de Usuario.
- Se validaron redirección, historial, capacidades internas y preservación de
  la experiencia de las tres vistas.
- La norma transversal quedó institucionalizada en
  `docs/ui/dashboard-shell/guidelines.md` y sus primeras adopciones se
  registraron en `docs/ui/adoption-log.md`.
- `typecheck`, lint, build y `git diff --check` terminaron sin errores nuevos.

## Current Status

Iniciativa completada y validada.
