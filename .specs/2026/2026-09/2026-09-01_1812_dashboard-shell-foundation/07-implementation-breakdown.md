# Breakdown de Implementación

## Slice 1. Primitivas sin integración productiva

- Crear `DashboardShellFrame` y las primitivas de headers/canvas.
- Modelar `scrollMode` sin estados globales ni dependencias de dominio.
- Probar su composición con contenido estático local.

## Slice 2. Ruta Playground

- Crear `/dashboard-playground` con el guard existente y un layout paralelo.
- Agregar un selector exclusivo de Playground para alternar las variantes de
  scroll de escritorio.
- Usar placeholders estáticos para las utilidades globales.

## Slice 3. Validación responsive

- Verificar que la variante móvil use flujo de documento.
- Verificar que el modo workspace no conserve overflow en Page Content Scroller.
- Verificar que el modo page-composition mantenga fijo Workspace Header y no
  deje overflow en Page Content Scroller.
- Verificar que el modo page-content no desplace Global Header ni Workspace Header.

## Slice 4. Cierre

- Actualizar task list y progress.
- Ajustar `docs/ui/` solo si la implementación revela una regla reusable nueva.
- No registrar una migración de módulo real: Playground es referencia, no
  adopción productiva.
