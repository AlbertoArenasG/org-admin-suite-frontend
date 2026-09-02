# Progreso

## 2026-09-01

- Se creó la spec `dashboard-shell-foundation`.
- Se consolidaron como referencias vivas el modelo y las guidelines en `docs/ui/`.
- La definición quedó lista para implementar sin migrar el shell productivo.
- Se completó el Slice 1: se crearon primitivas aisladas para Global Header,
  Workspace Canvas, Workspace Header y Page Content Scroller.
- `DashboardShellFrame` propaga el modo de scroll a canvas y contenido para
  impedir dos dueños verticales simultáneos.
- Se completó el Slice 2: se creó `/dashboard/playground/dashboard-shell` con
  contenido neutral, Global Header visual y selector de variantes de scroll en
  escritorio.
- La composición móvil usa Document Scroll por CSS; falta validación visual
  manual como parte del Slice 3.
- Se validaron typecheck, lint y diff sin errores introducidos por la iniciativa.
  Lint conserva dos warnings preexistentes fuera de este trabajo.
- El build de producción no pudo completarse en este entorno porque `next/font`
  no logró descargar fuentes desde `fonts.googleapis.com`. No se detectaron
  errores de compilación atribuibles al dashboard shell.
- La validación visual manual de desktop, móvil y ambos modos de scroll queda
  pendiente en la ruta Playground con un servidor de desarrollo activo.
