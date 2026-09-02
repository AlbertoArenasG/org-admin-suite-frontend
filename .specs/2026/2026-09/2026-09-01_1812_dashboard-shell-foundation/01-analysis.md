# Análisis

## Iniciativa

- Name: `dashboard-shell-foundation`
- Date: `2026-09-01`

## Estado Actual

- `src/app/dashboard/layout.tsx` compone `SidebarProvider`, `AppSidebar` y
  `SidebarInset` junto con el contenedor visual actual del dashboard.
- `DashboardPageHeader` mezcla hoy el trigger compartido y los breadcrumbs de
  cada ruta.
- `AppSidebar` ya resuelve navegación, permisos, rail, pane y la representación
  móvil mediante los primitives de sidebar existentes.
- Las rutas Playground actuales solo documentan el modelo abstracto; todavía no
  existe una implementación neutral del shell reutilizando sus componentes.

## Hallazgos

- La nueva estructura puede construirse como componentes de contenido sin
  acoplarse a `AppSidebar` ni modificar el layout activo.
- `Global Header` y `Workspace Header` deben ser componentes separados: el
  primero expresa utilidades globales y el segundo contexto de ruta.
- El dueño de scroll debe declararse de forma explícita por composición, no
  deducirse accidentalmente de estilos `overflow`.
- El Playground es el lugar correcto para validar desktop y móvil antes de
  cambiar rutas de negocio.

## Dependencias

- `src/components/ui/sidebar.tsx` para el trigger y el comportamiento de
  navegación existente.
- `src/components/shared/DashboardPageHeader.tsx` y breadcrumbs actuales como
  referencia de integración, sin requerir su reemplazo en esta entrega.
- `docs/ui/dashboard-shell/structure-model.md` y
  `docs/ui/dashboard-shell/guidelines.md` como referencias vivas.

## Riesgos

- Crear componentes demasiado amplios o acoplados a una sola ruta.
- Introducir dos contenedores verticales scrolleables en la misma vista.
- Confundir placeholders visuales de cuenta/notificaciones con funcionalidad
  aprobada.
- Alterar el shell productivo antes de validar la composición neutral.

## Restricciones

- No hay contratos backend, slices ni stores nuevos en esta iniciativa.
- No se modifica autorización, permisos, navegación ni la cuenta actual.
- No se migra ningún módulo real ni se redefine `Page Composition`.
