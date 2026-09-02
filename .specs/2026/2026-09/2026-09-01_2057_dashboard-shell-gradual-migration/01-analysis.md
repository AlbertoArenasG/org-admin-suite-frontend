# Analisis

## Iniciativa

- Nombre: `dashboard-shell-gradual-migration`
- Fecha: `2026-09-01`

## Estado Actual

- `src/app/dashboard/layout.tsx` contiene `AuthGuard`, `SidebarProvider`,
  `AppSidebar`, `SidebarInset` y el marco visual del shell legado.
- Todas las paginas bajo `/dashboard` heredan ese layout; una ruta hija no
  puede seleccionar un layout hermano que evite al padre.
- `src/app/dashboard-playground/layout.tsx` demuestra que el nuevo shell puede
  coexistir en un arbol paralelo, pero aun no representa una ruta productiva.
- `src/components/dashboard-shell/` contiene primitivas neutras: frame,
  headers, canvas, composicion y dueños de scroll.
- `docs/ui/dashboard-shell/` contiene la referencia viva normativa de esas
  capas y sus modos de scroll.

## Hallazgos

- Sustituir directamente `DashboardLayout` por el nuevo shell seria una
  migracion big bang y regresion potencial de todas las rutas existentes.
- Duplicar rutas bajo otro prefijo permitiria layouts separados, pero degrada
  navegacion, enlaces y validacion de la adopcion real.
- El boundary correcto es un selector central dentro del layout padre: ambos
  shells comparten auth y cada uno compone su propia estructura visual.
- El shell legado debe extraerse sin cambios de comportamiento antes de que el
  boundary elija entre implementaciones.

## Restricciones

- El layout de `/dashboard` no debe seguir acumulando markup ni condicionales
  visuales de ambos shells.
- Las paginas de negocio no deben saber que shell las envuelve.
- Solo existe un dueño principal de scroll por ruta, conforme a las guidelines.
- En movil, las adopciones usan `Document Scroll`; no heredan contenedores de
  scroll interno de escritorio.
- La cuenta actual del sidebar y los placeholders del Global Header no cambian
  funcionalmente en esta iniciativa.

## Riesgos

- Una politica de ruta demasiado amplia puede activar el nuevo shell para
  descendientes no migrados.
- Extraer el shell legado con cambios de clases puede introducir regresiones
  sutiles de viewport, sidebar u overflow.
- Una pagina migrada puede conservar wrappers que compitan con el dueño de
  scroll seleccionado.
- La mezcla de cambios estructurales y rediseño de dominio dificulta aislar
  regresiones y revertir.
