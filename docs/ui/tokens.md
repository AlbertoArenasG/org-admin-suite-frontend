# Estrategia de Tokens de UI

**Registrado:** 2 de septiembre de 2026  
**Estado:** Guideline viva para componentes y patrones nuevos.

## Propósito

Los componentes nuevos deben consumir tokens semánticos en lugar de colores o
valores visuales directos. Esto permite mantener consistencia, preparar la
aplicación para futuros temas completos y evitar que cada vista defina su
propia variante visual.

Esta preparación no se difiere hasta una futura iniciativa de multitemas. Es un
requisito para cada componente nuevo y para cada componente o vista que se
reestructure durante la migración gradual.

## Niveles de Tokens

### Fundacionales

Representan valores compartidos de toda la interfaz: color de fondo, texto,
borde, radio, tipografía, espaciado y escalas de color. Antes de crear uno
nuevo, se deben revisar los tokens fundacionales existentes.

Ejemplos: `--background`, `--foreground`, `--card`, `--border`, `--ring`.

Los gutters de `Page Content Scroller` son un contrato estructural compartido,
no una receta de tema: `--dashboard-page-content-padding-{block,inline,inline-wide}`.
Se declaran junto con la composición en `styles/dashboard/page-composition.css`
y se aplican mediante `padding="default"`. El valor predeterminado es
`padding="none"`, para que una vista migrada elija explícitamente su propia
composición antes de recibir gutters.

### Semánticos de Superficie

Representan el rol visual de una capa o región, no un color concreto. Deben
usarse cuando una superficie tenga una responsabilidad reutilizable.

Ejemplos: `--workspace-canvas-surface`, `--module-surface`,
`--module-surface-border`, `--control-surface`, `--surface-bg`,
`--data-grid-header-bg`, `--dashboard-shell-surface` y
`--dashboard-shell-glass-surface`.

La familia `--dashboard-shell-glass-*` describe una receta reutilizable de
material: superficie, imagen, borde, sombra y backdrop. `Navigation Shell` y
`Content Inset` deben consumir la misma receta dentro de cada tema; sus
subregiones pueden tener tokens propios solo cuando expresen otro rol visual.

`Workspace Canvas` usa su propia receta mediante
`--workspace-canvas-{surface,border,border-width,shadow,radius}`. Esta capa es
operativa y deliberadamente sobria: no hereda el mesh ni el material de vidrio
del shell. Los valores de esta receta se declaran por tema, no se derivan de
`--background`; cada apariencia puede redefinirlos sin cambiar la primitiva ni
las vistas que la consumen.

`Page Composition` hereda el canvas como decisión visual inicial, pero su
transparencia también es una receta explícita por tema:
`--page-composition-{surface,image}`. Los temas actuales declaran
`transparent` y `none`; un tema futuro puede redefinir esos valores sin
convertir la composición en una excepción por vista.

`Page Header` usa una receta independiente por tema:
`--page-header-{surface,image,border,foreground,description-foreground,metadata-foreground,eyebrow-foreground}`.
La base actual es sobria y transparente, pero un tema futuro puede ajustar su
material o jerarquía cromática sin modificar el componente ni cada página.

`DashboardButton` usa una receta independiente por tema para sus roles `primary`,
`secondary`, `outline`, `ghost`, `destructive` y `link`. Cada rol declara su
material y, cuando aplica, borde y hover; foco, transición y disabled se
declaran mediante `--button-*`. `Button` conserva su contrato Legacy; una
vista nueva o migrada no debe introducir color directo en sus botones.

Su chrome interno usa una familia independiente por tema:
`--workspace-chrome-{foreground,border,control-hover,avatar-surface,avatar-border}`.
Estos tokens cubren toolbar, breadcrumbs, trigger y cuenta sin acoplarlos a
los bordes, foregrounds o hovers genéricos de tablas, formularios y popovers.

Los breadcrumbs del Workspace amplían esa familia con
`--workspace-chrome-breadcrumb-{foreground,hover-surface,hover-foreground,current-foreground,current-indicator}`.
`PageBreadcrumbs` debe recibir `tone="workspace"` solo dentro de un
`DashboardWorkspaceHeader`; su variante predeterminada sigue siendo el
contrato compartido compatible con legacy.

La navegación del dashboard también separa su jerarquía y sus estados de
marca mediante `--dashboard-navigation-{section-label,rail,item,item-muted,control,account-secondary}-foreground`,
`--dashboard-navigation-subtree-border` y
`--dashboard-navigation-brand-toggle-{surface,hover-surface}`. No se deben
usar opacidades utilitarias sobre `--sidebar-foreground` ni reutilizar tokens
fundacionales de color para esos roles cuando se modifique esta composición.

`DashboardWorkspaceCanvas` conserva fallbacks locales solo para un montaje
accidental fuera del scope temático. `NextDashboardShell` siempre debe recibir
la receta desde la apariencia activa; esos fallbacks no constituyen una fuente
visual alternativa ni un contrato de tema.

### Recetas de Interacción

Los temas también son dueños de la expresión de interacción de los patrones
compartidos. La lógica funcional permanece en React: una ruta activa, la
apertura de un menú, el colapso del pane o el disparo de una acción no son
configuración temática. Lo que varía por tema es cómo se manifiestan esos
estados: duración, curva, desplazamiento, foco, elevación, borde y material.

La capa exterior del dashboard tiene dos familias iniciales:

- `--dashboard-navigation-*`: colapso del shell, transición, foco, hover de
  rail, controles de navegación y apertura/cierre de secciones.
- `--workspace-chrome-*`: transición y foco de controles dentro del toolbar
  del Workspace Canvas, además de sus tokens visuales ya definidos.

Los valores de ambas familias deben declararse en cada `html.<tema>`, incluso
si las apariencias iniciales coinciden. Los componentes consumen esos tokens
desde `styles/dashboard/interactions.css`; no deben volver a introducir
duraciones, curvas, `translate` de hover ni anillos de foco directos dentro de
sus clases.

Al crear un patrón interactivo nuevo, se debe decidir si su comportamiento es
estructural compartido o una expresión que un tema pueda cambiar. Solo en el
segundo caso se agrega una receta temática. No se debe tokenizar la lógica de
negocio ni crear un token por cada evento aislado.

Para el `Next Dashboard`, los valores de todos los tokens visuales se declaran
en cada `html.<tema>`. `:root` conserva sólo bootstrap no temático, como la
tipografía. Si se introduce un token visual, se completa su valor en todas las
apariencias activas dentro del mismo cambio.

### Específicos de Componente o Patrón

Se crean únicamente si un componente compartido o patrón reutilizable necesita
una variante visual que no expresa un token existente.

Ejemplos potenciales: encabezado de tabla, agrupación de formulario, panel de
detalle o controles de una lista.

Los archivos `styles/themes/dashboard-*.css` son el único dueño de valores por
tema. Cada uno resuelve el mismo contrato base de shadcn, controles,
superficies, radios y composición. No se agregan selectores de un componente
particular a esos archivos.

El CSS local base conserva estructura, layout, animación y tamaños propios. Una
receta visual exclusiva puede declarar tokens locales en archivos co-localizados
por tema, acotados a `html.<tema>` y a una clase estable del componente. Debe
existir un archivo para cada tema activo y cada uno declara todos los tokens de
la receta, aunque algunos valores coincidan temporalmente; no hay valores
visuales de respaldo en el CSS base del componente. No se reasignan tokens
fundacionales en scopes locales.

Los bundles externos siguen la estrategia de
[installed-components.md](./components/installed-components.md): importan
primitives canónicas desde `src/components/ui` y no mantienen copias privadas.

## Escala De Radio

`--radius` es el único valor de radio declarado por tema. La escala de
utilidades `rounded-sm` a `rounded-4xl` se deriva de ese valor en
`src/app/globals.css`, siguiendo la proporción recomendada por shadcn. Un tema
puede redefinir solo `--radius`; no declara radios semánticos adicionales.

En Next Dashboard se respeta la escala estándar de shadcn/Tailwind. No se crean
tokens semánticos de radio ni overrides locales, salvo una necesidad visual
justificada.

## Controles Compactos

Los controles que conviven en filtros, formularios compactos o toolbars
consumen este contrato estructural fundacional:

```css
--control-height-compact: 2rem;
--control-padding-inline: 0.75rem;
--control-gap: 0.5rem;
```

El control es responsable de consumir altura y padding. Su radio deriva de
`--radius`: las utilidades `rounded-*` resuelven la escala de shadcn y el CSS
de una primitive externa consume `var(--radius)` directamente cuando no puede
usar utilidades. La vista solo compone controles mediante flex o grid y decide
el ancho disponible; no redeclara su densidad. El Date Range Picker, Lookup
con búsqueda y Menú de filtros son los primeros consumidores de este contrato.

El mismo contrato visual compartido define `--control-surface`,
`--control-border`, `--control-foreground`, `--control-hover-surface`,
`--control-focus-ring`, `--control-shadow` y los tokens de selección. Cada
tema resuelve esos valores; los controles los consumen para que una toolbar no
combine fondos, bordes, hover o foco incongruentes.

Una primitive externa aprobada, directa o dentro de una familia vendor, consume
el contrato semántico existente (`--control-*` cuando corresponda) directamente.
`vendor` no introduce un wrapper para traducir tokens. El CSS estructural o de
animación exclusivo de esa familia vive junto a sus fuentes y se importa una
vez desde el alcance global cuando sus portales lo requieran. Si la familia
necesita roles visuales nuevos y reutilizables, cada tema activo declara su
archivo completo; no se resuelve mediante valores por defecto de otro tema.

## Criterio de Creación

Crear un token cuando el valor:

- Describe un rol visual con intención reutilizable.
- Puede requerir variación entre temas o apariencias.
- Se repite en más de un componente, módulo o patrón aprobado.

No crear un token cuando el valor es una decisión local, temporal o exclusiva
de una sola vista. En ese caso se deben componer los tokens existentes.

## Proceso Para Componentes Nuevos

1. Revisar los tokens existentes antes de agregar estilos visuales.
2. Componer con tokens fundacionales o semánticos cuando cubran el caso.
3. Si falta un rol reutilizable, proponer y definir un token con nombre
   semántico, sin asociarlo a un color concreto.
4. Usar el token desde el componente compartido o patrón correspondiente.
5. Al migrar una pieza heredada, reemplazar los valores visuales directos que
   toque esa migración por el contrato semántico aplicable.
6. Cuando el patrón esté aprobado, actualizar este documento o su guideline
   específica en `patterns/` o `components/`.

## Expresión Visual Futura

El contrato debe permitir temas completos con expresiones visuales distintas:

- **Plana:** superficies sobrias, sin textura ambiental, blur ni elevación
  decorativa innecesaria en toda la aplicación.
- **Ambient:** una composición coherente de fondo, navegación, content inset y
  contenido con ambient mesh, materiales o elevación sutiles.

Ambas expresiones deben cubrir todas las capas que compongan un tema. Un tema
ambient no debe limitarse al shell, ni un tema plano debe conservar decoración
ambient residual en el contenido.

Incluso en temas ambient, el contenido operativo debe preservar jerarquía,
contraste y sobriedad: tablas, formularios y datos son la región visualmente
más clara y menos decorada de la aplicación.

## Temas Futuros

Los tokens son la base de los temas de aplicación ya implementados y de sus
futuras extensiones. Un tema puede redefinir tokens por capa sin reescribir
componentes. La dirección vigente está registrada en
[application-theming.md](./initiatives/application-theming.md). Agregar una
variante nueva o ampliar el contrato a superficies aún no cubiertas requiere
una spec propia.

Las tres variantes iniciales son `Clásico`, `Ambient clásico` y `Ambient
profundo` (identificadores internos `classic`, `ambient` y `ambient-deep`),
todas con contenido operativo claro. Por ello, los componentes nuevos deben
quedar preparados no
solo para variaciones de color, sino también para variaciones semánticas de
material: textura ambiental, transparencia, borde y elevación. Estas
variaciones se expresarán mediante tokens por rol, nunca mediante condiciones
visuales embebidas en una vista.

Los componentes de MUI también deberán alinearse con estos tokens cuando se
incorporen nuevos temas.
