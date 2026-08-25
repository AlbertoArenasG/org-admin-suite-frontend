# Task List

## Phase 1. Navigation Domain

- [ ] Crear tipos de navegación, grupos y entradas.
- [ ] Crear las definiciones centralizadas de grupos, rutas, labels e iconos.
- [ ] Extraer las reglas actuales de visibilidad a un adaptador que invoque `hasModule` y `hasPermission`.
- [ ] Crear el resolvedor de entradas visibles, grupos vacíos y ruta activa.
- [ ] Crear `useSidebarNavigation` para coordinar ruta, autorización y selección temporal de grupo.

## Phase 2. Navigation Components

- [ ] Crear `SidebarBrand` con navegación a Dashboard y controles de expansión aprobados.
- [ ] Crear `SidebarGroupRail` con iconos, tooltips, foco y estado activo.
- [ ] Crear `SidebarNavigationPane` con las entradas del grupo seleccionado.
- [ ] Crear `SidebarAccountMenu` con perfil, preferencias y cierre de sesión.
- [ ] Extraer piezas reutilizables de tema e idioma necesarias para los submenús de cuenta sin romper las vistas públicas.

## Phase 3. Shell Migration And Dashboard

- [ ] Sustituir el árbol de navegación de `AppSidebar` por el nuevo shell.
- [ ] Integrar escritorio expandido, escritorio colapsado y drawer móvil.
- [ ] Mantener el botón hamburguesa móvil como control explícito del drawer.
- [ ] Reubicar cuenta y retirar los controles sueltos de tema e idioma.
- [ ] Simplificar Dashboard y retirar sus cards, widgets y consultas de negocio.
- [ ] Eliminar `NavMain`, `NavUser` y `SidebarLogo` si quedan sin referencias.

## Phase 4. Localisation, Verification And Closure

- [ ] Agregar y validar copies localizados necesarios.
- [ ] Ejecutar lint dirigido, typecheck y `git diff --check`.
- [ ] Validar manualmente visibilidad de módulos, subrutas y grupos vacíos.
- [ ] Validar rutas directas, selección de grupo y navegación desde logo/Dashboard.
- [ ] Validar escritorio expandido/colapsado, teclado, reducción de movimiento y móvil.
- [ ] Validar jerarquía visual, estados activos y transiciones contra el lenguaje visual existente.
- [ ] Validar cuenta, Mi perfil, tema, idioma y cierre de sesión.
- [ ] Actualizar documentos de la spec e índice al cierre.
