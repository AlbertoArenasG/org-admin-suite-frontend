# Decisions

## Decision 01. Dashboard Outside Functional Groups

### Final Decision

- Dashboard queda fuera de los grupos funcionales.
- Se muestra como acceso fijo de primer nivel para todo usuario autenticado.
- No depende de `hasModule` ni `hasPermission`.
- La pagina se simplifica y queda sin cards, widgets ni consultas de negocio.
- La personalizacion futura de Dashboard queda fuera de esta spec.

### Status

approved

---

## Decision 02. Logo As Dashboard Shortcut

### Final Decision

- El contenedor del logo deja de ser decorativo.
- Navega a `/dashboard`.
- Incluye semantica accesible y estados de foco/hover discretos.
- No sustituye al acceso fijo de Dashboard del rail ni modifica el grupo activo.

### Status

approved

---

## Decision 03. Account And Preferences Footer

### Final Decision

- La cuenta autenticada se ubica al pie del shell de navegacion.
- Vive en un componente aislado de la logica de grupos, rutas y permisos.
- Agrupa perfil, tema, idioma y cierre de sesion.
- En escritorio usa un menu contextual; en movil se adaptara al patron que se defina para el drawer.

### Status

approved

---

## Decision 04. Right Panel Excluded

### Final Decision

- No se incorpora sidebar o panel derecho en esta spec.
- No se crea infraestructura preventiva para un panel derecho.
- Un centro de atencion, inspector contextual u otra funcion futura requerira su propia spec y caso de uso concreto.

### Status

approved

---

## Decision 05. Functional Group Taxonomy And Movable Entries

### Final Decision

- Dashboard permanece como acceso fijo fuera de los grupos.
- Los grupos iniciales son:
  - `Operación`: Servicios y Control de activos y pagos.
  - `Directorio`: Clientes, Proveedores y Contactos.
  - `Comunicación`: Grupos de destinatarios.
  - `Configuración`: Vencimientos.
  - `Administración`: Usuarios y Roles.
- Directorio concentra las fichas maestras y su administración base. Los procesos futuros que reutilicen clientes o proveedores se ubicarán según su propósito, no por la entidad que consuman.
- La pertenencia de cada entrada a un grupo vive en la configuración de navegación. Mover una entrada en el futuro no debe modificar rutas, reglas de visibilidad, permisos ni componentes de autorización.
- La configuración de grupos no puede convertirse en una fuente de verdad de autorización.
- Antes de renderizar el rail, cada grupo se filtra con las reglas existentes de `hasModule` y `hasPermission`; los grupos sin entradas visibles no se muestran.

### Status

approved

---

## Decision 06. Rail And Sidebar Navigation Interaction

### Final Decision

- La estructura izquierda usa los términos `Rail de grupos` para la columna angosta de iconos y `Sidebar de navegación` para la columna de rutas.
- Dashboard es un acceso fijo del Rail de grupos y navega a `/dashboard`.
- Seleccionar un grupo en el Rail de grupos cambia únicamente el contenido del Sidebar de navegación; no navega por sí solo.
- Al navegar mediante una entrada o una URL directa, se selecciona automáticamente el grupo propietario de la ruta.
- La selección del grupo no se persiste; al recargar, la ruta actual determina el grupo seleccionado.
- Al seleccionar Dashboard, el Sidebar de navegación permanece visible y muestra Dashboard como entrada activa. No se implementan aún favoritos, accesos rápidos ni preferencias de Dashboard.

### Status

approved

---

## Decision 07. Group Icons And Route Membership

### Final Decision

- Los iconos iniciales del Rail de grupos son:
  - Dashboard: `LayoutDashboard`.
  - Operación: `Wrench`.
  - Directorio: `BookUser`.
  - Comunicación: `Send`.
  - Configuración: `Settings2`.
  - Administración: `ShieldCheck`.
- Se usa `BookUser` en lugar de `AddressBook` porque `AddressBook` no se exporta en la versión instalada de `lucide-react`.
- La pertenencia inicial de las rutas es:
  - Operación: todas las rutas de Servicios, Control de activos y pagos, encuestas de servicio y Recepción, Recolección y Entrega.
  - Directorio: todas las rutas de Clientes, Proveedores y Contactos.
  - Comunicación: todas las rutas de Grupos de destinatarios.
  - Configuración: todas las rutas de políticas de estatus y notificación de vencimiento.
  - Administración: todas las rutas de Usuarios, invitaciones de registro y Roles.
- Cada entrada conserva sus reglas de visibilidad actuales, incluidas las subrutas de lista, creación, edición y detalle.

### Status

approved

---

## Decision 08. Desktop And Mobile Sidebar Behavior

### Final Decision

- En escritorio expandido se muestran Rail de grupos y Sidebar de navegación.
- El contenedor de marca muestra el logo y el nombre de la organización; el botón para contraer vive a su derecha.
- En escritorio colapsado permanece el Rail de grupos. El isotipo de marca revela el botón para expandir mediante `hover` o foco de teclado; el control no depende exclusivamente de hover.
- El Sidebar de navegación se oculta con transición breve de ancho y opacidad, respeta preferencias de reducción de movimiento y recupera el grupo previamente seleccionado al expandirse.
- No existe expansión automática al pasar el cursor por el Rail de grupos.
- En móvil no existe el estado persistente de Rail colapsado: la navegación está oculta y se abre mediante un botón de menú hamburguesa como drawer superpuesto.
- El drawer móvil contiene la navegación completa, se cierra con un control explícito, al seleccionar una ruta o al interactuar fuera de él.

### Status

approved

---

## Decision 09. Account And Preferences Experience

### Final Decision

- La cuenta es un componente aislado en el pie del Sidebar de navegación.
- Su activador muestra avatar, nombre y correo; en escritorio colapsado muestra solo avatar.
- El contenido reúne encabezado de identidad, acceso a Mi perfil, sección de Preferencias y cierre de sesión.
- Tema e idioma dejan de mostrarse como controles sueltos del sidebar y se presentan como submenús de Preferencias.
- En escritorio, la cuenta se abre en un menú contextual anclado al activador.
- En móvil, se abre como hoja inferior con las mismas acciones y objetivos táctiles amplios.
- El componente de cuenta no resuelve grupos, rutas del menú ni visibilidad por permisos.

### Status

approved

---

## Decision 10. Navigation Technical Boundary

### Final Decision

- `sidebar/navigation/types.ts` concentra los tipos de grupos, entradas y reglas visuales.
- `sidebar/navigation/definitions.ts` es la única configuración de grupos, iconos, rutas, labels y pertenencia.
- `sidebar/navigation/resolve.ts` filtra entradas mediante `hasModule` y `hasPermission`, elimina grupos vacíos y resuelve la ruta activa.
- `sidebar/useSidebarNavigation.ts` integra configuración, autorización existente, ruta, traducciones y selección temporal de grupo.
- `SidebarGroupRail.tsx` renderiza exclusivamente iconos, tooltips y selección.
- `SidebarNavigationPane.tsx` renderiza exclusivamente las rutas del grupo seleccionado.
- `SidebarBrand.tsx` concentra marca y control de expansión.
- `SidebarAccountMenu.tsx` concentra perfil, preferencias y cierre de sesión.
- `AppSidebar.tsx` queda como compositor del shell; no contiene catálogo, reglas de visibilidad ni árboles de rutas.
- La configuración de navegación no almacena permisos ni sustituye los métodos de autorización existentes.

### Status

approved

---

## Decision 11. Complete Navigation Migration

### Final Decision

- La migración reemplaza completamente la navegación actual; no existe compatibilidad temporal ni flags de transición.
- La fase de implementación crea la nueva configuración, resolvedor y componentes antes de reemplazar el contenido de `AppSidebar` en la misma entrega.
- `NavMain`, `NavUser` y `SidebarLogo` se sustituyen por sus equivalentes nuevos y se eliminan si no quedan referencias.
- Se reutilizan los primitives de `components/ui/sidebar` y los componentes compartidos de tema e idioma continúan disponibles para vistas públicas.
- Dashboard se simplifica durante la misma migración.
- No se conservan árboles de navegación heredados, fallback ni rutas alternativas de renderizado.

### Status

approved
