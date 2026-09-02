# Progreso

## 2026-09-01

- Se creó la spec `dashboard-shell-foundation`.
- Se consolidaron como referencias vivas el modelo y las guidelines en `docs/ui/`.
- La definición quedó lista para implementar sin migrar el shell productivo.
- Se completó el Slice 1: se crearon primitivas aisladas para Global Header,
  Workspace Canvas, Workspace Header y Page Content Scroller.
- `DashboardShellFrame` propaga el modo de scroll a canvas y contenido para
  impedir dos dueños verticales simultáneos.
