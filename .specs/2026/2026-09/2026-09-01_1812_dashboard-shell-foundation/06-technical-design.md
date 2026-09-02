# Diseño Técnico

## Alcance de Componentes

La implementación crea componentes de contenido bajo
`src/components/dashboard-shell/`. No deben importar rutas de negocio, stores,
contratos backend, permisos ni `AppSidebar`.

### DashboardShellFrame

Compone `Content Inset`, `Global Header`, `Workspace Canvas` y `Workspace
Header` mediante slots. No crea ni controla el sidebar.

### DashboardGlobalHeader

Recibe regiones de inicio, centro y final. El trigger, campana y avatar se
inyectan como contenido; el componente no implementa notificaciones ni cuenta.

### DashboardWorkspaceCanvas

Recibe `scrollMode` con los valores `page-content`, `page-composition` o
`workspace` para escritorio. Conserva una geometría fija dentro de `Content
Inset`; el modo solo determina qué región recibe el overflow vertical.

### DashboardWorkspaceHeader

Recibe el contenido contextual de la ruta, inicialmente breadcrumbs. No conoce
datos de navegación ni genera rutas por sí mismo.

### DashboardPageContentScroller

Expresa el dueño de scroll en el modo `page-content`. En modo `workspace` pasa
a ser flujo normal dentro del canvas, sin segundo `overflow-y`.

### DashboardPageComposition

Agrupa `Page Header` y `Page Content Scroller`. En modo `page-composition`
recibe el scroll vertical; en los demás modos no compite con el dueño activo.

## Resolución Responsive

- En escritorio, el frame usa una altura disponible y `min-h-0` para que el
  modo activo controle un único overflow vertical.
- En móvil, el frame no fija una región interna de scroll: el contenido vuelve
  al flujo del documento.
- `Content Inset` no expone marco decorativo de escritorio en la composición
  móvil del Playground.

## Ruta de Referencia

Se creará `/dashboard-playground`, protegida y con layout paralelo. La ruta
usará contenido largo y neutral; en escritorio permitirá inspeccionar los modos
`page-content`, `page-composition` y `workspace`.

## Integración Futura

Una migración posterior podrá integrar `DashboardShellFrame` en
`src/app/dashboard/layout.tsx` o adoptar sus primitivas por módulo. Esta spec
no modifica esa integración.

## Validación

- Inspección manual en desktop con ambos modos de scroll.
- Inspección manual en viewport móvil con scroll de documento.
- Verificar que no exista scroll horizontal accidental.
- `npm run typecheck`, lint disponible y `git diff --check`.
