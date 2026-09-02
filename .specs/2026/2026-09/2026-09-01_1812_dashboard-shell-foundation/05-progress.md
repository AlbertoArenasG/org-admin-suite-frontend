# Progreso

## 2026-09-01

- Se creó la spec `dashboard-shell-foundation`.
- Se consolidaron como referencias vivas el modelo y las guidelines en `docs/ui/`.
- La definición quedó lista para implementar sin migrar el shell productivo.
- Se completó el Slice 1: se crearon primitivas aisladas para Global Header,
  Workspace Canvas, Workspace Header y Page Content Scroller.
- `DashboardShellFrame` propaga el modo de scroll a canvas y contenido para
  impedir dos dueños verticales simultáneos.
- Se completó el Slice 2: se creó `/dashboard-playground` con contenido
  neutral, Global Header visual y selector de variantes de scroll en escritorio.
- La referencia se ejecuta con un layout paralelo que reutiliza autenticación y
  navegación, pero no hereda el `DashboardLayout` vigente. Esto permite validar
  la geometría y el scroll reales sin condicionales por ruta ni impacto en las
  vistas de negocio.
- En desktop, el layout aislado restringe la cadena `SidebarProvider` →
  `SidebarInset` → `Content Inset` al viewport. El modo activo es el único que
  recibe overflow vertical; en móvil se preserva `Document Scroll`.
- Se agregó `DashboardPageComposition` para formalizar el modo `Page
Composition Scroll`: conserva fijo `Workspace Header` y desplaza juntos
  `Page Header` y contenido.
- La composición móvil usa Document Scroll por CSS.
- Se validaron typecheck, lint y diff sin errores introducidos por la iniciativa.
  Lint conserva dos warnings preexistentes fuera de este trabajo.
- El build de producción no pudo completarse en este entorno porque `next/font`
  no logró descargar fuentes desde `fonts.googleapis.com`. No se detectaron
  errores de compilación atribuibles al dashboard shell.
- La validación visual manual fue aprobada en `/dashboard-playground` para
  desktop, móvil y los modos `Page Content Scroll`, `Page Composition Scroll`
  y `Workspace Canvas Scroll`.
- Tras mover la referencia a `/dashboard-playground`, `typecheck` local quedó
  bloqueado únicamente por una entrada obsoleta en `.next/types` para la ruta
  eliminada. Se retiró únicamente ese artefacto huérfano y `npm run typecheck`
  volvió a completarse correctamente.
- Las guidelines vivas y el modelo estructural se actualizaron con el tercer
  modo de scroll. No se registra adopción en `docs/ui/adoption-log.md` porque
  `/dashboard-playground` es una referencia aislada, no una ruta productiva.
- El shell aislado evita en escritorio la propagación del overscroll elástico
  desde el dueño activo de scroll para no revelar el fondo del documento en
  los límites de la región de trabajo.
