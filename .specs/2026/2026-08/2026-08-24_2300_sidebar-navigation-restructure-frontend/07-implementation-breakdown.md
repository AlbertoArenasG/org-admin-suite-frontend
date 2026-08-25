# Implementation Breakdown

## Phase 1. Navigation Domain

- Status: `planned`
- Objective: concentrar estructura y reglas de presentación fuera de `AppSidebar`.
- Files:
  - `src/components/sidebar/navigation/*`
  - `src/components/sidebar/useSidebarNavigation.ts`
- Exit criteria:
  - definiciones, adaptador y resolvedor separados
  - matriz de visibilidad actual preservada
  - grupos vacíos eliminados por el resolvedor
  - rutas directas identifican su grupo propietario

## Phase 2. Isolated Navigation Components

- Status: `planned`
- Objective: construir las piezas visuales sin lógica de autorización embebida.
- Files:
  - `src/components/sidebar/SidebarBrand.tsx`
  - `src/components/sidebar/SidebarGroupRail.tsx`
  - `src/components/sidebar/SidebarNavigationPane.tsx`
  - `src/components/sidebar/SidebarAccountMenu.tsx`
  - componentes compartidos de preferencias, si son necesarios
- Exit criteria:
  - rail, sidebar, marca y cuenta aislados
  - tooltips, foco y estados activos definidos
  - cuenta ofrece perfil, preferencias y logout en ambas superficies

## Phase 3. Shell Replacement And Dashboard Cleanup

- Status: `planned`
- Objective: reemplazar la implementación actual en una sola superficie de navegación.
- Files:
  - `src/components/sidebar/AppSidebar.tsx`
  - `src/components/ui/sidebar.tsx`, solo si el primitive requiere extensión localizada
  - `src/app/dashboard/layout.tsx`, si se requiere host del disparador móvil
  - `src/app/dashboard/page.tsx`
  - componentes heredados de sidebar
- Exit criteria:
  - escritorio expandido, colapsado y móvil operativos
  - menú hamburguesa abre el drawer móvil completo
  - no quedan controles sueltos de tema e idioma
  - Dashboard queda sin contenido de negocio
  - no quedan referencias a componentes heredados

## Phase 4. Localisation, Verification And Closure

- Status: `planned`
- Objective: validar regresiones de acceso y cerrar documentación.
- Files:
  - `src/locales/es/*`
  - `src/locales/en/*`
  - `.specs/2026/2026-08/2026-08-24_2300_sidebar-navigation-restructure-frontend/*`
- Exit criteria:
  - copies nuevos localizados
  - lint, typecheck y `git diff --check` exitosos
  - validación manual de permisos, rutas, responsive y cuenta completada
  - documentos e índice actualizados al cierre
