# Technical Design

## Status

- Design status: `approved`
- Ready for implementation

## Navigation Data Flow

```text
definitions + authorization adapter + pathname
                    |
                    v
          navigation resolver
                    |
                    v
visible groups + selected group + active entries
                    |
                    v
Rail de grupos + Sidebar de navegación + drawer móvil
```

La configuración describe estructura visual. El adaptador consulta la autorización vigente. El resolvedor elimina entradas y grupos no visibles sin cambiar la fuente de verdad de permisos.

## Navigation Domain

Nueva carpeta propuesta:

- `src/components/sidebar/navigation`

Archivos:

- `types.ts`: contratos de grupo, entrada, subentrada y resultado resuelto.
- `definitions.ts`: grupos, iconos, translation keys, rutas y relaciones de pertenencia.
- `visibility.ts`: adaptador de las reglas actuales que invoca `hasModule` y `hasPermission`.
- `resolve.ts`: filtrado, remoción de grupos vacíos y detección de entradas activas.

Tipos conceptuales:

```ts
type SidebarGroupId =
  | 'dashboard'
  | 'operation'
  | 'directory'
  | 'communication'
  | 'configuration'
  | 'administration';

type SidebarNavigationEntryId =
  | 'dashboard'
  | 'users'
  | 'roles'
  | 'expirationPolicies'
  | 'internalAssetControl'
  | 'contacts'
  | 'recipientGroups'
  | 'customers'
  | 'providers'
  | 'services';
```

Cada definición conserva:

- identificador estable
- grupo propietario
- translation key
- icono
- ruta principal
- predicado de coincidencia de ruta
- subentradas de lista, creación u otras superficies existentes

`visibility.ts` preserva exactamente la matriz actual, incluidos los casos donde un módulo se presenta si existe una combinación de operaciones. No se agregan reglas ni se infieren permisos nuevos.

El resolvedor recibe el resultado del adaptador, no estado Redux ni datos backend. Produce una estructura inmutable para renderizado con:

- entrada fija de Dashboard
- grupos con al menos una entrada visible
- entrada y grupo propietarios de la ruta actual

## Sidebar State

Nuevo hook propuesto:

- `src/components/sidebar/useSidebarNavigation.ts`

Responsabilidades:

- obtener `pathname`, traducciones y autorización actual
- resolver las entradas visibles
- seleccionar inicialmente el grupo de la ruta activa
- actualizar la selección al entrar por ruta directa o navegar a una entrada
- conservar una selección temporal solo durante la sesión de la vista

La selección temporal no se escribe en URL, Redux, local storage ni backend. La ruta prevalece al recargar.

## Components

### `AppSidebar`

Responsabilidad exclusiva: componer el shell de navegación y pasar datos resueltos a sus hijos. No declara rutas, permisos ni árboles de menú.

### `SidebarBrand`

- Muestra logo y nombre de organización.
- Navega a `/dashboard`.
- En escritorio expandido, muestra el control de contraer a la derecha.
- En escritorio colapsado, conserva el isotipo y revela el control de expandir en hover o foco.

### `SidebarGroupRail`

- Renderiza Dashboard y grupos visibles.
- Usa los iconos aprobados y tooltips accesibles.
- Cambia el grupo seleccionado sin navegar, salvo Dashboard.
- Mantiene indicador visual del grupo seleccionado y de la ruta activa.

### `SidebarNavigationPane`

- Muestra Dashboard o las entradas del grupo seleccionado.
- Mantiene la jerarquía actual de módulos y subrutas.
- Solo recibe datos ya filtrados; no conoce `hasModule` ni `hasPermission`.

### `SidebarAccountMenu`

- Obtiene o recibe los datos visuales de la cuenta autenticada.
- En escritorio usa menú contextual; en móvil usa hoja inferior.
- Expone Mi perfil, tema, idioma y cierre de sesión.
- No participa en la resolución de navegación.

## Desktop And Mobile Shell

En escritorio, el shell contiene Rail de grupos y Sidebar de navegación. Al contraer, el rail permanece y el sidebar se retira mediante transición de ancho y opacidad de 200 a 250 ms; la implementación debe respetar `prefers-reduced-motion`.

La experiencia toma como referencia la jerarquía de dos niveles, los estados activos inequívocos y la continuidad espacial de Slack y Discord. No replica sus colores, tipografía, densidad ni componentes: conserva los tokens, el lenguaje visual y la identidad existente de la aplicación.

El resultado debe priorizar:

- contraste claro entre Rail de grupos y Sidebar de navegación
- indicador activo reconocible para grupo y ruta, sin competir con el contenido
- transiciones intencionales y breves, sin saltos de layout
- tooltips, foco visible y objetivos táctiles adecuados

En móvil, el rail no permanece visible. Un botón hamburguesa abre el drawer con navegación completa. El drawer se cierra con su control explícito, al seleccionar una ruta o al interactuar fuera de él.

El disparador móvil continúa siendo una responsabilidad de navegación y se muestra solo debajo del breakpoint de escritorio; no representa el estado de colapsado del escritorio.

## Account Preferences

`ModeToggle` y `SelectLang` se mantienen disponibles para páginas públicas. Para el menú de cuenta se extraerán piezas de selección reutilizables o se adaptarán sus APIs sin duplicar la lógica de `next-themes` ni de `i18next`.

El menú de escritorio usa submenús de preferencias. La hoja móvil presenta las mismas opciones de manera directa y táctil.

## Dashboard

`src/app/dashboard/page.tsx` conserva la ruta y el shell, pero elimina cards, widgets y consultas de negocio. No se agrega contenido sustituto ni personalización en esta spec.

## Legacy Removal

Una vez integrada la nueva composición, se revisan y eliminan si quedan sin referencias:

- `NavMain.tsx`
- `NavUser.tsx`
- `SidebarLogo.tsx`

No se conserva código alternativo de navegación.

## Validation Boundary

La implementación debe demostrar que:

- el mismo rol ve exactamente los módulos y subrutas que antes podía ver
- un grupo sin entradas visibles no aparece en el rail
- una ruta directa selecciona el grupo propietario
- Dashboard es accesible para todo usuario autenticado
- cambiar de grupo no concede acceso ni altera URL de forma inesperada
- las preferencias y logout siguen funcionando desde cuenta
